-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query) after
-- creating your project. Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE throughout.

create extension if not exists vector;

-- One row per indexed chunk (portfolio constants, GitHub READMEs, or blog posts).
create table if not exists content_chunks (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,       -- 'constants' | 'readme' | 'blog'
  source_id text not null,         -- e.g. a project slug, or blog_posts.id
  title text,
  content text not null,
  url text,
  embedding vector(1024) not null, -- Bedrock cohere.embed-multilingual-v3 (1024 dims)
  updated_at timestamptz default now()
);

-- HNSW keeps good recall regardless of when rows are added (ivfflat built on an empty
-- table does not).
create index if not exists content_chunks_embedding_idx
  on content_chunks using hnsw (embedding vector_cosine_ops);

create index if not exists content_chunks_source_idx
  on content_chunks (source_type, source_id);

-- Cosine-similarity retrieval, called from the backend via supabase.rpc('match_chunks', ...).
-- Chunks below min_similarity are dropped so weak matches never reach the model.
create or replace function match_chunks(
  query_embedding vector(1024),
  match_count int,
  min_similarity float default 0
)
returns table (
  id uuid,
  source_type text,
  title text,
  content text,
  url text,
  similarity float
)
language sql stable as $$
  select
    id, source_type, title, content, url,
    1 - (embedding <=> query_embedding) as similarity
  from content_chunks
  where 1 - (embedding <=> query_embedding) >= min_similarity
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- Blog posts, written by the admin API (service-role key) and read publicly (anon key + RLS).
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content_md text not null,
  tags text[] default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

drop policy if exists "public read published posts" on blog_posts;
create policy "public read published posts"
  on blog_posts for select
  using (published = true);

-- No insert/update/delete policy for anon: writes only happen via the Lambda's
-- service-role key (admin.py), which bypasses RLS entirely.

alter table content_chunks enable row level security;
-- Deliberately no policies here: content_chunks is never read by the anon key,
-- only server-side (RPC call above uses the service-role key from the Lambda).

create table if not exists chat_sessions (
  id uuid primary key,                         -- generated in the visitor's browser tab
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  emailed_at timestamptz                       -- last time this transcript was emailed
);

create table if not exists chat_messages (
  id bigint generated always as identity primary key,
  session_id uuid not null references chat_sessions(id) on delete cascade,
  channel text not null,                       -- 'chat' | 'voice'
  language text,
  role text not null,                          -- 'user' | 'assistant'
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_idx on chat_messages (session_id, id);
create index if not exists chat_sessions_pending_idx on chat_sessions (last_message_at)
  where emailed_at is null;

-- Server-side only (service-role key): no policies, so the anon key can't read transcripts.
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- Records one question/answer pair in a single round trip.
create or replace function log_chat_turn(
  p_session_id uuid, p_channel text, p_language text, p_user text, p_assistant text
) returns void language sql as $$
  insert into chat_sessions (id) values (p_session_id)
    on conflict (id) do update set last_message_at = now();
  insert into chat_messages (session_id, channel, language, role, content) values
    (p_session_id, p_channel, p_language, 'user', p_user),
    (p_session_id, p_channel, p_language, 'assistant', p_assistant);
$$;

-- Atomically marks a session as emailed if it has messages that haven't been emailed yet.
-- Returns true only to the one caller that should send the email (no duplicates).
create or replace function claim_session_for_email(p_session_id uuid)
returns boolean language sql as $$
  with claimed as (
    update chat_sessions set emailed_at = now()
    where id = p_session_id and (emailed_at is null or emailed_at < last_message_at)
    returning id
  )
  select exists (select 1 from claimed);
$$;

-- For the scheduled sweep: claims sessions idle for idle_minutes that still need an email.
create or replace function claim_idle_sessions(idle_minutes int)
returns setof uuid language sql as $$
  update chat_sessions set emailed_at = now()
  where (emailed_at is null or emailed_at < last_message_at)
    and last_message_at < now() - make_interval(mins => idle_minutes)
  returning id;
$$;

-- Only the backend (service role) may call these, never the public anon key.
revoke execute on function log_chat_turn(uuid, text, text, text, text) from public, anon, authenticated;
revoke execute on function claim_session_for_email(uuid) from public, anon, authenticated;
revoke execute on function claim_idle_sessions(int) from public, anon, authenticated;

-- Recruiter / visitor details the assistant collected, summarized when the transcript is emailed.
alter table chat_sessions add column if not exists lead jsonb;

-- Every contact-form message, plus emails recruiters leave in the chat. ack_sent_at records the
-- acknowledgment sent from notifications@ (at most one per address per 24h, to prevent abuse).
create table if not exists contact_messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  source text not null,                        -- 'form' | 'chat' | 'transcript_copy'
  name text,
  email text not null,
  message text,
  session_id uuid,                             -- chat_sessions.id for 'chat'
  ack_sent_at timestamptz
);

create index if not exists contact_messages_email_idx on contact_messages (email, ack_sent_at desc);  -- emails stored lowercased

-- Server-side only (service-role key), like the transcripts.
alter table contact_messages enable row level security;
