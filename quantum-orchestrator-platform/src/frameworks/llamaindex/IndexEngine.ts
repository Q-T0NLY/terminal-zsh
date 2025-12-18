import { Injectable, Logger } from '@nestjs/common';
import { Document, IndexConfig, IndexStats, VectorStore, ChunkingStrategy } from './LlamaIndexInterface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Index Engine - Document indexing for LlamaIndex
 */
@Injectable()
export class IndexEngine {
  private readonly logger = new Logger(IndexEngine.name);
  public id: string;
  public documents: Map<string, Document>;
  public chunks: Map<string, { docId: string; content: string; embedding?: number[] }>;
  public vectorStore: VectorStore;
  public config: IndexConfig;

  constructor(config: IndexConfig, vectorStore: VectorStore) {
    this.id = config.id;
    this.config = config;
    this.documents = new Map();
    this.chunks = new Map();
    this.vectorStore = vectorStore;
  }

  /**
   * Add documents to the index
   */
  async addDocuments(docs: Document[]): Promise<void> {
    const startTime = Date.now();

    try {
      for (const doc of docs) {
        // Store document
        this.documents.set(doc.id, doc);

        // Chunk document
        const docChunks = this.chunkDocument(doc);

        // Generate embeddings and store
        for (const chunk of docChunks) {
          const chunkId = `${doc.id}:${chunk.index}`;
          
          // Simple embedding (in production, use actual embedding model)
          const embedding = await this.generateEmbedding(chunk.content);
          
          this.chunks.set(chunkId, {
            docId: doc.id,
            content: chunk.content,
            embedding,
          });

          await this.vectorStore.add(chunkId, embedding, {
            docId: doc.id,
            content: chunk.content,
            metadata: doc.metadata,
          });
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Added ${docs.length} documents to index ${this.id} in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to add documents to index ${this.id}:`, error);
      throw error;
    }
  }

  /**
   * Build index (finalize indexing)
   */
  async buildIndex(): Promise<void> {
    this.logger.log(`Index ${this.id} built with ${this.documents.size} documents`);
  }

  /**
   * Get index statistics
   */
  getStats(): IndexStats {
    return {
      totalDocuments: this.documents.size,
      totalChunks: this.chunks.size,
      indexSize: JSON.stringify(Array.from(this.documents.values())).length,
      lastUpdated: new Date(),
    };
  }

  /**
   * Chunk document based on strategy
   */
  private chunkDocument(doc: Document): Array<{ index: number; content: string }> {
    const chunks: Array<{ index: number; content: string }> = [];
    const chunkSize = this.config.chunkSize || 512;
    const overlap = this.config.chunkOverlap || 50;

    // Fixed size chunking
    const words = doc.content.split(' ');
    let index = 0;

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      const content = chunkWords.join(' ');
      
      if (content.trim()) {
        chunks.push({ index: index++, content });
      }
    }

    return chunks;
  }

  /**
   * Generate embedding (simplified - in production use actual model)
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    // Simple hash-based embedding for demonstration
    const hash = this.simpleHash(text);
    const dimensions = 768; // Standard embedding dimension
    const embedding: number[] = [];

    for (let i = 0; i < dimensions; i++) {
      embedding.push(Math.sin(hash + i) * 0.5 + 0.5);
    }

    return embedding;
  }

  /**
   * Simple hash function
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * Delete document from index
   */
  async deleteDocument(docId: string): Promise<void> {
    this.documents.delete(docId);

    // Delete all chunks for this document
    const chunksToDelete: string[] = [];
    for (const [chunkId, chunk] of this.chunks.entries()) {
      if (chunk.docId === docId) {
        chunksToDelete.push(chunkId);
      }
    }

    for (const chunkId of chunksToDelete) {
      this.chunks.delete(chunkId);
      await this.vectorStore.delete(chunkId);
    }

    this.logger.log(`Document ${docId} deleted from index ${this.id}`);
  }
}
