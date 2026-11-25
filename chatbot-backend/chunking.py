"""Simple paragraph-aware text chunker shared by anything that needs to embed long content
(currently just admin.py for blog posts; scripts/reindex.mjs has its own JS equivalent for
the portfolio constants + READMEs since that script runs in Node, not Python)."""


def chunk_text(text: str, max_chars: int = 700, overlap: int = 100) -> list[str]:
    text = text.strip()
    if not text:
        return []
    if len(text) <= max_chars:
        return [text]

    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        candidate = f"{current}\n\n{para}".strip() if current else para
        if len(candidate) <= max_chars:
            current = candidate
            continue

        if current:
            chunks.append(current)
        if len(para) <= max_chars:
            current = para
        else:
            # paragraph itself is too long; hard-split with overlap
            start = 0
            while start < len(para):
                end = start + max_chars
                chunks.append(para[start:end])
                start = end - overlap
            current = ""

    if current:
        chunks.append(current)

    return chunks
