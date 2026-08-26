-- Knowledge base for RAG (Retrieval-Augmented Generation)
-- Stores chunked source documents with embeddings for semantic search.

create extension if not exists vector;

create table knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  source_url text,
  source_title text,
  source_type text check (source_type in ('article', 'book', 'interview', 'podcast', 'website', 'raw_text')),
  body text not null,
  embedding vector(1536),   -- OpenAI text-embedding-3-small dimension
  chunk_index integer,
  scene_id uuid references scenes(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Cosine similarity search index
create index on knowledge_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Full text search index for keyword fallback
create index on knowledge_chunks using gin (to_tsvector('english', body));

alter table knowledge_chunks enable row level security;
create policy "public read" on knowledge_chunks for select using (true);

-- Match function used by the Ask API
create or replace function match_knowledge(
  query_embedding vector(1536),
  match_count int default 5,
  match_threshold float default 0.5
)
returns table (
  id uuid,
  body text,
  source_title text,
  source_url text,
  source_type text,
  similarity float
)
language sql stable
as $$
  select
    kc.id,
    kc.body,
    kc.source_title,
    kc.source_url,
    kc.source_type,
    1 - (kc.embedding <=> query_embedding) as similarity
  from knowledge_chunks kc
  where 1 - (kc.embedding <=> query_embedding) > match_threshold
  order by kc.embedding <=> query_embedding
  limit match_count;
$$;
