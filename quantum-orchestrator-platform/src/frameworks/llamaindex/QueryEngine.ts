import { Injectable, Logger } from '@nestjs/common';
import { QueryResult, VectorStore } from './LlamaIndexInterface';
import { IndexEngine } from './IndexEngine';

/**
 * Query Engine - Query and retrieval for LlamaIndex
 */
@Injectable()
export class QueryEngine {
  private readonly logger = new Logger(QueryEngine.name);

  constructor(private readonly indexEngine: IndexEngine) {}

  /**
   * Query the index
   */
  async query(
    queryText: string,
    topK: number = 5,
    filter?: Record<string, any>,
  ): Promise<QueryResult> {
    const startTime = Date.now();

    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(queryText);

      // Vector search
      const searchResults = await this.indexEngine.vectorStore.search(
        queryEmbedding,
        topK,
      );

      // Format results
      const results = searchResults.map((result) => {
        const doc = this.indexEngine.documents.get(result.metadata.docId);
        return {
          document: doc!,
          score: result.score,
          chunk: result.metadata.content,
        };
      });

      // Apply metadata filter if provided
      const filteredResults = filter
        ? results.filter((r) => this.matchesFilter(r.document.metadata, filter))
        : results;

      // Synthesize response (simplified)
      const synthesizedResponse = this.synthesizeResponse(queryText, filteredResults);

      const executionTime = Date.now() - startTime;
      this.logger.log(`Query executed in ${executionTime}ms, found ${filteredResults.length} results`);

      return {
        results: filteredResults,
        synthesizedResponse,
        executionTime,
      };
    } catch (error) {
      this.logger.error('Query failed:', error);
      throw error;
    }
  }

  /**
   * Hybrid search (vector + keyword)
   */
  async hybridSearch(
    queryText: string,
    keywords: string[],
    topK: number = 5,
  ): Promise<QueryResult> {
    const startTime = Date.now();

    try {
      // Get vector search results
      const vectorResults = await this.query(queryText, topK * 2);

      // Filter by keywords
      const keywordFiltered = vectorResults.results.filter((result) =>
        keywords.some((keyword) =>
          result.chunk.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );

      // Take top K
      const results = keywordFiltered.slice(0, topK);

      const executionTime = Date.now() - startTime;

      return {
        results,
        synthesizedResponse: this.synthesizeResponse(queryText, results),
        executionTime,
      };
    } catch (error) {
      this.logger.error('Hybrid search failed:', error);
      throw error;
    }
  }

  /**
   * Generate embedding (simplified)
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    const hash = this.simpleHash(text);
    const dimensions = 768;
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
   * Match document metadata against filter
   */
  private matchesFilter(metadata: Record<string, any>, filter: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(filter)) {
      if (metadata[key] !== value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Synthesize response from search results
   */
  private synthesizeResponse(query: string, results: QueryResult['results']): string {
    if (results.length === 0) {
      return 'No relevant documents found for your query.';
    }

    const topChunks = results.slice(0, 3).map((r) => r.chunk);
    
    return `Based on the query "${query}", here are the most relevant findings:\n\n` +
      topChunks.map((chunk, i) => `${i + 1}. ${chunk.substring(0, 200)}...`).join('\n\n');
  }
}
