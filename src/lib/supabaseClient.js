import { createClient } from '@supabase/supabase-js'

// Public anon key - safe to expose client-side. Blog reads are restricted to
// published posts only via the Row Level Security policy in supabase/schema.sql.
// Writes never happen from the browser; the admin panel goes through the Lambda API instead.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export default supabase
