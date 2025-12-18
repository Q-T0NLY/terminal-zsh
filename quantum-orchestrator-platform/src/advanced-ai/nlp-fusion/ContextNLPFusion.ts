import { Injectable, Logger } from '@nestjs/common';

/**
 * Context/NLP Fusion - Multi-source context with NLP processing
 */

export interface ContextSource {
  id: string;
  name: string;
  content: string;
  metadata: Record<string, any>;
  weight: number; // 0-1, importance of this source
  timestamp: Date;
}

export interface NLPFeatures {
  entities: NamedEntity[];
  keywords: Keyword[];
  sentiment: SentimentAnalysis;
  topics: Topic[];
  summary: string;
}

export interface NamedEntity {
  text: string;
  type: 'email' | 'url' | 'number' | 'proper_noun' | 'date' | 'other';
  position: { start: number; end: number };
}

export interface Keyword {
  word: string;
  score: number; // TF-IDF score
  frequency: number;
}

export interface SentimentAnalysis {
  polarity: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
}

export interface Topic {
  name: string;
  keywords: string[];
  relevance: number; // 0 to 1
}

export interface FusedContext {
  content: string;
  sources: string[];
  relevanceScore: number;
  tokenCount: number;
  features?: NLPFeatures;
}

@Injectable()
export class ContextNLPFusion {
  private readonly logger = new Logger(ContextNLPFusion.name);
  private contexts: Map<string, ContextSource> = new Map();
  
  // Sentiment keywords
  private positiveWords = new Set([
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'love', 'best', 'perfect', 'awesome', 'brilliant', 'outstanding',
  ]);
  
  private negativeWords = new Set([
    'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst',
    'hate', 'disappointing', 'failed', 'error', 'problem', 'issue',
  ]);

  /**
   * Add context source
   */
  addContext(source: Omit<ContextSource, 'id' | 'timestamp'>): ContextSource {
    const id = `ctx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const fullSource: ContextSource = {
      id,
      timestamp: new Date(),
      ...source,
    };

    this.contexts.set(id, fullSource);
    this.logger.log(`Added context source: ${id} (${source.name})`);

    return fullSource;
  }

  /**
   * Extract NLP features from text
   */
  extractFeatures(text: string): NLPFeatures {
    const entities = this.extractEntities(text);
    const keywords = this.extractKeywords(text);
    const sentiment = this.analyzeSentiment(text);
    const topics = this.extractTopics(text, keywords);
    const summary = this.generateSummary(text);

    return {
      entities,
      keywords,
      sentiment,
      topics,
      summary,
    };
  }

  /**
   * Named Entity Recognition (NER)
   */
  private extractEntities(text: string): NamedEntity[] {
    const entities: NamedEntity[] = [];

    // Email detection
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    let match;
    while ((match = emailRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'email',
        position: { start: match.index, end: match.index + match[0].length },
      });
    }

    // URL detection
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/g;
    while ((match = urlRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'url',
        position: { start: match.index, end: match.index + match[0].length },
      });
    }

    // Number detection
    const numberRegex = /\b\d+(\.\d+)?\b/g;
    while ((match = numberRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'number',
        position: { start: match.index, end: match.index + match[0].length },
      });
    }

    // Proper nouns (capitalized words)
    const properNounRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    while ((match = properNounRegex.exec(text)) !== null) {
      // Avoid duplicating URLs and emails
      const isUrl = entities.some(e => e.type === 'url' && 
        match!.index >= e.position.start && match!.index < e.position.end);
      const isEmail = entities.some(e => e.type === 'email' && 
        match!.index >= e.position.start && match!.index < e.position.end);
      
      if (!isUrl && !isEmail) {
        entities.push({
          text: match[0],
          type: 'proper_noun',
          position: { start: match.index, end: match.index + match[0].length },
        });
      }
    }

    return entities;
  }

  /**
   * Keyword extraction using TF-IDF
   */
  private extractKeywords(text: string, topK: number = 10): Keyword[] {
    // Tokenize
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3); // Filter short words

    // Calculate term frequency
    const termFreq = new Map<string, number>();
    for (const word of words) {
      termFreq.set(word, (termFreq.get(word) || 0) + 1);
    }

    // Common stop words to filter
    const stopWords = new Set([
      'the', 'this', 'that', 'with', 'from', 'have', 'will', 'would',
      'could', 'should', 'their', 'there', 'about', 'which', 'when',
    ]);

    // Calculate scores (simplified TF-IDF)
    const keywords: Keyword[] = [];
    for (const [word, freq] of termFreq.entries()) {
      if (!stopWords.has(word)) {
        const tf = freq / words.length;
        // Simplified IDF (in real implementation, use corpus statistics)
        const idf = Math.log(1 + 1 / (freq + 1));
        const score = tf * idf;

        keywords.push({ word, score, frequency: freq });
      }
    }

    // Return top keywords
    return keywords
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Sentiment analysis
   */
  private analyzeSentiment(text: string): SentimentAnalysis {
    const words = text.toLowerCase().split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of words) {
      if (this.positiveWords.has(word)) {
        positiveCount++;
      }
      if (this.negativeWords.has(word)) {
        negativeCount++;
      }
    }

    const total = positiveCount + negativeCount;
    
    if (total === 0) {
      return {
        polarity: 'neutral',
        score: 0,
        confidence: 0.5,
      };
    }

    const score = (positiveCount - negativeCount) / total;
    const confidence = total / words.length;

    let polarity: 'positive' | 'negative' | 'neutral';
    if (score > 0.1) {
      polarity = 'positive';
    } else if (score < -0.1) {
      polarity = 'negative';
    } else {
      polarity = 'neutral';
    }

    return {
      polarity,
      score,
      confidence: Math.min(confidence * 2, 1), // Normalize confidence
    };
  }

  /**
   * Topic extraction
   */
  private extractTopics(text: string, keywords: Keyword[]): Topic[] {
    const topics: Topic[] = [];

    // Group keywords into topics based on co-occurrence
    const topicClusters = this.clusterKeywords(keywords);

    for (let i = 0; i < topicClusters.length; i++) {
      const cluster = topicClusters[i];
      const topicKeywords = cluster.map(k => k.word);
      const avgRelevance = cluster.reduce((sum, k) => sum + k.score, 0) / cluster.length;

      topics.push({
        name: `Topic ${i + 1}`,
        keywords: topicKeywords,
        relevance: avgRelevance,
      });
    }

    return topics;
  }

  /**
   * Simple keyword clustering for topic extraction
   */
  private clusterKeywords(keywords: Keyword[]): Keyword[][] {
    if (keywords.length === 0) {
      return [];
    }

    // Simple clustering: top 3 keywords = 1 topic, next 3 = another topic, etc.
    const clusters: Keyword[][] = [];
    const clusterSize = 3;

    for (let i = 0; i < keywords.length; i += clusterSize) {
      clusters.push(keywords.slice(i, i + clusterSize));
    }

    return clusters.filter(cluster => cluster.length > 0);
  }

  /**
   * Text summarization (extractive)
   */
  private generateSummary(text: string, maxSentences: number = 3): string {
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (sentences.length <= maxSentences) {
      return text;
    }

    // Score sentences by keyword density
    const keywords = this.extractKeywords(text, 20);
    const keywordSet = new Set(keywords.map(k => k.word));

    const scoredSentences = sentences.map((sentence, index) => {
      const words = sentence.toLowerCase().split(/\s+/);
      const keywordCount = words.filter(w => keywordSet.has(w)).length;
      const score = keywordCount / words.length;

      return { sentence, score, index };
    });

    // Select top sentences and maintain order
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSentences)
      .sort((a, b) => a.index - b.index);

    return topSentences.map(s => s.sentence).join('. ') + '.';
  }

  /**
   * Fuse multiple context sources
   */
  fuseContexts(
    sourceIds: string[],
    query?: string,
    maxTokens: number = 2000,
  ): FusedContext {
    const sources: ContextSource[] = [];
    
    for (const id of sourceIds) {
      const source = this.contexts.get(id);
      if (source) {
        sources.push(source);
      }
    }

    if (sources.length === 0) {
      return {
        content: '',
        sources: [],
        relevanceScore: 0,
        tokenCount: 0,
      };
    }

    // Rank sources by relevance if query provided
    let rankedSources = sources;
    if (query) {
      rankedSources = this.rankByRelevance(sources, query);
    } else {
      // Rank by weight
      rankedSources = sources.sort((a, b) => b.weight - a.weight);
    }

    // Aggregate context up to token limit
    let fusedContent = '';
    let tokenCount = 0;
    const usedSources: string[] = [];

    for (const source of rankedSources) {
      const sourceTokens = this.estimateTokens(source.content);
      
      if (tokenCount + sourceTokens <= maxTokens) {
        fusedContent += `\n\n[${source.name}]\n${source.content}`;
        tokenCount += sourceTokens;
        usedSources.push(source.id);
      } else {
        // Add partial content if there's room
        const remainingTokens = maxTokens - tokenCount;
        if (remainingTokens > 100) {
          const partialContent = this.truncateToTokens(source.content, remainingTokens);
          fusedContent += `\n\n[${source.name}]\n${partialContent}...`;
          tokenCount += remainingTokens;
          usedSources.push(source.id);
        }
        break;
      }
    }

    // Calculate relevance score
    const totalWeight = sources.reduce((sum, s) => sum + s.weight, 0);
    const usedWeight = sources
      .filter(s => usedSources.includes(s.id))
      .reduce((sum, s) => sum + s.weight, 0);
    const relevanceScore = totalWeight > 0 ? usedWeight / totalWeight : 0;

    // Extract features from fused content
    const features = this.extractFeatures(fusedContent);

    return {
      content: fusedContent.trim(),
      sources: usedSources,
      relevanceScore,
      tokenCount,
      features,
    };
  }

  /**
   * Rank sources by relevance to query
   */
  private rankByRelevance(sources: ContextSource[], query: string): ContextSource[] {
    const queryKeywords = this.extractKeywords(query, 10);
    const queryKeywordSet = new Set(queryKeywords.map(k => k.word));

    return sources.map(source => {
      const sourceKeywords = this.extractKeywords(source.content, 20);
      const overlap = sourceKeywords.filter(k => queryKeywordSet.has(k.word)).length;
      const relevance = overlap / Math.max(queryKeywords.length, 1);

      return { source, relevance: relevance * source.weight };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .map(item => item.source);
  }

  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Truncate text to approximate token count
   */
  private truncateToTokens(text: string, maxTokens: number): string {
    const approxChars = maxTokens * 4;
    
    if (text.length <= approxChars) {
      return text;
    }

    // Truncate at sentence boundary if possible
    const truncated = text.substring(0, approxChars);
    const lastPeriod = truncated.lastIndexOf('.');
    
    if (lastPeriod > approxChars * 0.8) {
      return truncated.substring(0, lastPeriod + 1);
    }

    return truncated;
  }

  /**
   * Get context by ID
   */
  getContext(id: string): ContextSource | null {
    return this.contexts.get(id) || null;
  }

  /**
   * List all contexts
   */
  listContexts(): ContextSource[] {
    return Array.from(this.contexts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Remove context
   */
  removeContext(id: string): boolean {
    const deleted = this.contexts.delete(id);
    if (deleted) {
      this.logger.log(`Removed context: ${id}`);
    }
    return deleted;
  }

  /**
   * Clear all contexts
   */
  clearContexts(): void {
    this.contexts.clear();
    this.logger.log('All contexts cleared');
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalContexts: number;
    totalTokens: number;
    avgWeight: number;
  } {
    const contexts = Array.from(this.contexts.values());
    const totalTokens = contexts.reduce(
      (sum, ctx) => sum + this.estimateTokens(ctx.content),
      0,
    );
    const avgWeight = contexts.length > 0
      ? contexts.reduce((sum, ctx) => sum + ctx.weight, 0) / contexts.length
      : 0;

    return {
      totalContexts: contexts.length,
      totalTokens,
      avgWeight,
    };
  }
}
