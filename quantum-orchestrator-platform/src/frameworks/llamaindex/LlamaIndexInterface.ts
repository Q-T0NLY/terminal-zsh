/**
 * LlamaIndex Framework Interfaces and Types
 */

export interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

export interface IndexConfig {
  id: string;
  name: string;
  embeddingModel: string;
  chunkSize: number;
  chunkOverlap: number;
  vectorStore: 'memory' | 'pinecone' | 'weaviate' | 'chroma';
}

export interface IndexStats {
  totalDocuments: number;
  totalChunks: number;
  indexSize: number;
  lastUpdated: Date;
}

export interface QueryResult {
  results: Array<{
    document: Document;
    score: number;
    chunk: string;
  }>;
  synthesizedResponse?: string;
  executionTime: number;
}

export interface EmbeddingModel {
  name: string;
  dimensions: number;
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export interface VectorStore {
  add(id: string, vector: number[], metadata: any): Promise<void>;
  search(vector: number[], topK: number): Promise<Array<{ id: string; score: number; metadata: any }>>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}

export enum ChunkingStrategy {
  FIXED_SIZE = 'FIXED_SIZE',
  SENTENCE = 'SENTENCE',
  SEMANTIC = 'SEMANTIC',
}
