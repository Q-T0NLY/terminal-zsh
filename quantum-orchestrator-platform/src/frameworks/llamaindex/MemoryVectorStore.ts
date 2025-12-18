import { Injectable } from '@nestjs/common';
import { VectorStore } from './LlamaIndexInterface';

/**
 * In-Memory Vector Store implementation
 */
@Injectable()
export class MemoryVectorStore implements VectorStore {
  private vectors = new Map<string, { vector: number[]; metadata: any }>();

  async add(id: string, vector: number[], metadata: any): Promise<void> {
    this.vectors.set(id, { vector, metadata });
  }

  async search(
    queryVector: number[],
    topK: number,
  ): Promise<Array<{ id: string; score: number; metadata: any }>> {
    const results: Array<{ id: string; score: number; metadata: any }> = [];

    // Calculate cosine similarity for each vector
    for (const [id, { vector, metadata }] of this.vectors.entries()) {
      const score = this.cosineSimilarity(queryVector, vector);
      results.push({ id, score, metadata });
    }

    // Sort by score descending and return top K
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  async delete(id: string): Promise<void> {
    this.vectors.delete(id);
  }

  async clear(): Promise<void> {
    this.vectors.clear();
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimension');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }
}
