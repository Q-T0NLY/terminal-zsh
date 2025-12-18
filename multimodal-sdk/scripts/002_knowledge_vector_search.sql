-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to knowledge_items table if it doesn't exist
ALTER TABLE knowledge_items ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create index for faster similarity search
CREATE INDEX IF NOT EXISTS knowledge_items_embedding_idx ON knowledge_items 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function for semantic search
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  content text,
  type text,
  tags text[],
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_items.id,
    knowledge_items.user_id,
    knowledge_items.title,
    knowledge_items.content,
    knowledge_items.type,
    knowledge_items.tags,
    knowledge_items.metadata,
    1 - (knowledge_items.embedding <=> query_embedding) as similarity
  FROM knowledge_items
  WHERE 1 - (knowledge_items.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_items.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
