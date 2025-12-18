import { Injectable, Logger } from '@nestjs/common';

/**
 * DAG/RAG++ Engine - Directed Acyclic Graph Retrieval-Augmented Generation
 * Advanced retrieval system with multi-strategy search and intelligent fusion
 */

export interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface QueryNode {
  id: string;
  query: string;
  type: 'semantic' | 'keyword' | 'hybrid' | 'structured';
  dependencies: string[];
  results?: SearchResult[];
}

export interface SearchResult {
  document: Document;
  score: number;
  strategy: string;
}

export interface DAGNode {
  id: string;
  query: string;
  dependencies: string[];
  level: number;
}

export enum FusionStrategy {
  LINEAR = 'linear',
  RRF = 'reciprocal_rank_fusion',
  WEIGHTED = 'weighted',
  NEURAL = 'neural',
}

@Injectable()
export class DAGRAGEngine {
  private readonly logger = new Logger(DAGRAGEngine.name);
  private documents: Map<string, Document> = new Map();
  private queryCache: Map<string, SearchResult[]> = new Map();

  /**
   * Index documents for retrieval
   */
  async indexDocuments(docs: Document[]): Promise<void> {
    const startTime = Date.now();

    for (const doc of docs) {
      // Generate embedding if not provided
      if (!doc.embedding) {
        doc.embedding = await this.generateEmbedding(doc.content);
      }
      this.documents.set(doc.id, doc);
    }

    const duration = Date.now() - startTime;
    this.logger.log(`Indexed ${docs.length} documents in ${duration}ms`);
  }

  /**
   * Build Query DAG - Decompose complex query into sub-queries
   */
  buildQueryDAG(complexQuery: string): DAGNode[] {
    const nodes: DAGNode[] = [];
    
    // Analyze query structure
    const subQueries = this.decomposeQuery(complexQuery);
    
    // Build DAG with dependencies
    subQueries.forEach((subQuery, index) => {
      const dependencies = index > 0 ? [nodes[index - 1].id] : [];
      nodes.push({
        id: `node-${index}`,
        query: subQuery,
        dependencies,
        level: index,
      });
    });

    return nodes;
  }

  /**
   * Execute DAG-based RAG generation
   */
  async generate(query: string, topK: number = 5): Promise<{
    results: SearchResult[];
    dag: DAGNode[];
    executionTime: number;
  }> {
    const startTime = Date.now();

    // Build query DAG
    const dag = this.buildQueryDAG(query);

    // Execute DAG in topological order
    const allResults: SearchResult[] = [];
    
    for (const node of dag) {
      const nodeResults = await this.executeNode(node, topK);
      allResults.push(...nodeResults);
    }

    // Deduplicate and rerank
    const finalResults = this.deduplicateAndRerank(allResults, topK);

    const executionTime = Date.now() - startTime;

    return {
      results: finalResults,
      dag,
      executionTime,
    };
  }

  /**
   * Multi-strategy search
   */
  async multiStrategySearch(
    query: string,
    strategies: Array<'semantic' | 'keyword' | 'hybrid' | 'structured'>,
    topK: number = 5,
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    for (const strategy of strategies) {
      const strategyResults = await this.executeStrategy(query, strategy, topK);
      results.push(...strategyResults);
    }

    return results;
  }

  /**
   * Fusion strategies for combining results
   */
  fuseResults(
    results: SearchResult[],
    strategy: FusionStrategy,
    topK: number = 5,
  ): SearchResult[] {
    switch (strategy) {
      case FusionStrategy.LINEAR:
        return this.linearFusion(results, topK);
      
      case FusionStrategy.RRF:
        return this.reciprocalRankFusion(results, topK);
      
      case FusionStrategy.WEIGHTED:
        return this.weightedFusion(results, topK);
      
      case FusionStrategy.NEURAL:
        return this.neuralFusion(results, topK);
      
      default:
        return this.linearFusion(results, topK);
    }
  }

  /**
   * Execute a single DAG node
   */
  private async executeNode(node: DAGNode, topK: number): Promise<SearchResult[]> {
    // Check cache
    const cacheKey = `${node.query}-${topK}`;
    if (this.queryCache.has(cacheKey)) {
      return this.queryCache.get(cacheKey)!;
    }

    // Execute semantic search
    const results = await this.semanticSearch(node.query, topK);

    // Cache results
    this.queryCache.set(cacheKey, results);

    return results;
  }

  /**
   * Semantic search using embeddings
   */
  private async semanticSearch(query: string, topK: number): Promise<SearchResult[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    const results: SearchResult[] = [];

    for (const [id, doc] of this.documents.entries()) {
      if (doc.embedding) {
        const score = this.cosineSimilarity(queryEmbedding, doc.embedding);
        results.push({
          document: doc,
          score,
          strategy: 'semantic',
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  /**
   * Keyword search using TF scoring
   */
  private keywordSearch(query: string, topK: number): SearchResult[] {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const results: SearchResult[] = [];

    for (const [id, doc] of this.documents.entries()) {
      const content = doc.content.toLowerCase();
      let score = 0;

      for (const term of queryTerms) {
        const termCount = (content.match(new RegExp(term, 'g')) || []).length;
        score += termCount / queryTerms.length;
      }

      if (score > 0) {
        results.push({
          document: doc,
          score,
          strategy: 'keyword',
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  /**
   * Execute specific search strategy
   */
  private async executeStrategy(
    query: string,
    strategy: 'semantic' | 'keyword' | 'hybrid' | 'structured',
    topK: number,
  ): Promise<SearchResult[]> {
    switch (strategy) {
      case 'semantic':
        return await this.semanticSearch(query, topK);
      
      case 'keyword':
        return this.keywordSearch(query, topK);
      
      case 'hybrid':
        const semanticResults = await this.semanticSearch(query, topK);
        const keywordResults = this.keywordSearch(query, topK);
        return this.fuseResults([...semanticResults, ...keywordResults], FusionStrategy.WEIGHTED, topK);
      
      case 'structured':
        // For structured queries, use field-based search
        return await this.semanticSearch(query, topK);
      
      default:
        return await this.semanticSearch(query, topK);
    }
  }

  /**
   * Linear fusion - simple average
   */
  private linearFusion(results: SearchResult[], topK: number): SearchResult[] {
    const scoreMap = new Map<string, { total: number; count: number; doc: Document }>();

    for (const result of results) {
      const existing = scoreMap.get(result.document.id);
      if (existing) {
        existing.total += result.score;
        existing.count += 1;
      } else {
        scoreMap.set(result.document.id, {
          total: result.score,
          count: 1,
          doc: result.document,
        });
      }
    }

    const fused: SearchResult[] = [];
    for (const [id, { total, count, doc }] of scoreMap.entries()) {
      fused.push({
        document: doc,
        score: total / count,
        strategy: 'linear-fusion',
      });
    }

    return fused.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  /**
   * Reciprocal Rank Fusion (RRF)
   */
  private reciprocalRankFusion(results: SearchResult[], topK: number): SearchResult[] {
    const k = 60; // RRF constant
    const scoreMap = new Map<string, { score: number; doc: Document }>();

    // Group by document and calculate RRF score
    results.forEach((result, rank) => {
      const rrf = 1 / (k + rank + 1);
      const existing = scoreMap.get(result.document.id);
      
      if (existing) {
        existing.score += rrf;
      } else {
        scoreMap.set(result.document.id, {
          score: rrf,
          doc: result.document,
        });
      }
    });

    const fused: SearchResult[] = [];
    for (const [id, { score, doc }] of scoreMap.entries()) {
      fused.push({
        document: doc,
        score,
        strategy: 'rrf-fusion',
      });
    }

    return fused.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  /**
   * Weighted fusion - 60/40 split between strategies
   */
  private weightedFusion(results: SearchResult[], topK: number): SearchResult[] {
    const weights = {
      semantic: 0.6,
      keyword: 0.4,
      hybrid: 0.5,
      structured: 0.5,
    };

    const scoreMap = new Map<string, { total: number; doc: Document }>();

    for (const result of results) {
      const weight = weights[result.strategy as keyof typeof weights] || 0.5;
      const weightedScore = result.score * weight;
      
      const existing = scoreMap.get(result.document.id);
      if (existing) {
        existing.total += weightedScore;
      } else {
        scoreMap.set(result.document.id, {
          total: weightedScore,
          doc: result.document,
        });
      }
    }

    const fused: SearchResult[] = [];
    for (const [id, { total, doc }] of scoreMap.entries()) {
      fused.push({
        document: doc,
        score: total,
        strategy: 'weighted-fusion',
      });
    }

    return fused.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  /**
   * Neural fusion - max-min weighted blend
   */
  private neuralFusion(results: SearchResult[], topK: number): SearchResult[] {
    const scoreMap = new Map<string, { scores: number[]; doc: Document }>();

    for (const result of results) {
      const existing = scoreMap.get(result.document.id);
      if (existing) {
        existing.scores.push(result.score);
      } else {
        scoreMap.set(result.document.id, {
          scores: [result.score],
          doc: result.document,
        });
      }
    }

    const fused: SearchResult[] = [];
    for (const [id, { scores, doc }] of scoreMap.entries()) {
      const max = Math.max(...scores);
      const min = Math.min(...scores);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      // Neural blend: weighted combination of max, min, and average
      const neuralScore = 0.5 * max + 0.3 * avg + 0.2 * min;
      
      fused.push({
        document: doc,
        score: neuralScore,
        strategy: 'neural-fusion',
      });
    }

    return fused.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  /**
   * Decompose complex query into sub-queries
   */
  private decomposeQuery(query: string): string[] {
    // Simple decomposition based on sentences and conjunctions
    const sentences = query.split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length > 1) {
      return sentences.map(s => s.trim());
    }

    // Split by conjunctions
    const parts = query.split(/\b(and|or|but)\b/i).filter(p => p.trim() && !['and', 'or', 'but'].includes(p.toLowerCase()));
    
    return parts.length > 1 ? parts.map(p => p.trim()) : [query];
  }

  /**
   * Deduplicate and rerank results
   */
  private deduplicateAndRerank(results: SearchResult[], topK: number): SearchResult[] {
    const seen = new Set<string>();
    const deduped: SearchResult[] = [];

    for (const result of results) {
      if (!seen.has(result.document.id)) {
        seen.add(result.document.id);
        deduped.push(result);
      }
    }

    return deduped.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  /**
   * Generate embedding for text
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    // Simple hash-based embedding for demonstration
    const hash = this.hashString(text);
    const dimensions = 768;
    const embedding: number[] = [];

    for (let i = 0; i < dimensions; i++) {
      embedding.push(Math.sin(hash + i) * 0.5 + 0.5);
    }

    return embedding;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      return 0;
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

  /**
   * Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * Get statistics
   */
  getStats(): {
    documentsIndexed: number;
    cacheSize: number;
  } {
    return {
      documentsIndexed: this.documents.size,
      cacheSize: this.queryCache.size,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.queryCache.clear();
    this.logger.log('Query cache cleared');
  }
}
