import { Injectable, Logger } from '@nestjs/common';

/**
 * Advanced Prompt Toolkit - Comprehensive prompt engineering system
 */

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  variables: string[];
  tags: string[];
  examples?: Array<{ input: Record<string, string>; output: string }>;
}

export interface PromptQualityMetrics {
  clarity: number; // 0-1
  specificity: number; // 0-1
  context: number; // 0-1
  instructions: number; // 0-1
  overall: number; // 0-1
}

export interface OptimizationSuggestion {
  type: 'clarity' | 'specificity' | 'context' | 'instructions';
  message: string;
  example?: string;
}

export interface ChainStep {
  id: string;
  prompt: string;
  dependsOn?: string[];
  output?: string;
}

@Injectable()
export class PromptToolkit {
  private readonly logger = new Logger(PromptToolkit.name);
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize pre-built templates
   */
  private initializeTemplates(): void {
    const builtInTemplates: PromptTemplate[] = [
      {
        id: 'code-explanation',
        name: 'Code Explanation',
        category: 'development',
        description: 'Explain code functionality',
        template: `Explain the following {{language}} code in detail:\n\n{{code}}\n\nProvide:\n1. High-level overview\n2. Line-by-line explanation\n3. Key concepts used\n4. Potential improvements`,
        variables: ['language', 'code'],
        tags: ['code', 'explanation', 'learning'],
      },
      {
        id: 'code-refactoring',
        name: 'Code Refactoring',
        category: 'development',
        description: 'Suggest code improvements',
        template: `Refactor this {{language}} code to improve {{focus}}:\n\n{{code}}\n\nConsider:\n- Clean code principles\n- Performance optimization\n- Maintainability\n- Best practices`,
        variables: ['language', 'code', 'focus'],
        tags: ['code', 'refactoring', 'optimization'],
      },
      {
        id: 'bug-fix',
        name: 'Bug Fix Assistant',
        category: 'development',
        description: 'Help debug code issues',
        template: `Debug this {{language}} code that has the following issue:\n\nIssue: {{issue}}\n\nCode:\n{{code}}\n\nProvide:\n1. Root cause analysis\n2. Step-by-step fix\n3. Prevention strategies`,
        variables: ['language', 'issue', 'code'],
        tags: ['debugging', 'bug-fix', 'troubleshooting'],
      },
      {
        id: 'test-generation',
        name: 'Test Generation',
        category: 'development',
        description: 'Generate unit tests',
        template: `Generate comprehensive unit tests for this {{language}} code using {{framework}}:\n\n{{code}}\n\nInclude:\n- Happy path tests\n- Edge cases\n- Error handling\n- Mock setups if needed`,
        variables: ['language', 'framework', 'code'],
        tags: ['testing', 'unit-tests', 'quality'],
      },
      {
        id: 'creative-writing',
        name: 'Creative Writing',
        category: 'content',
        description: 'Generate creative content',
        template: `Write a {{genre}} {{type}} about {{topic}}.\n\nStyle: {{style}}\nTone: {{tone}}\nLength: {{length}} words\n\nMake it engaging and original.`,
        variables: ['genre', 'type', 'topic', 'style', 'tone', 'length'],
        tags: ['writing', 'creative', 'content'],
      },
      {
        id: 'data-analysis',
        name: 'Data Analysis',
        category: 'analytics',
        description: 'Analyze data and provide insights',
        template: `Analyze the following {{dataType}} data:\n\n{{data}}\n\nProvide:\n1. Summary statistics\n2. Key insights\n3. Trends and patterns\n4. Recommendations\n5. Visualizations suggestions`,
        variables: ['dataType', 'data'],
        tags: ['analysis', 'data', 'insights'],
      },
      {
        id: 'chat-assistant',
        name: 'Chat Assistant',
        category: 'conversational',
        description: 'Conversational AI assistant',
        template: `You are a helpful {{role}} assistant. The user asks:\n\n{{question}}\n\nContext: {{context}}\n\nProvide a helpful, accurate, and friendly response.`,
        variables: ['role', 'question', 'context'],
        tags: ['chat', 'assistant', 'conversational'],
      },
      {
        id: 'structured-output',
        name: 'Structured Output',
        category: 'data',
        description: 'Generate structured data',
        template: `Generate {{format}} output for:\n\n{{description}}\n\nRequirements:\n{{requirements}}\n\nEnsure the output is valid {{format}} and follows best practices.`,
        variables: ['format', 'description', 'requirements'],
        tags: ['structured', 'data', 'format'],
      },
    ];

    for (const template of builtInTemplates) {
      this.templates.set(template.id, template);
    }

    this.logger.log(`Initialized ${builtInTemplates.length} built-in templates`);
  }

  /**
   * List all templates
   */
  listTemplates(filters?: {
    category?: string;
    tags?: string[];
  }): PromptTemplate[] {
    let templates = Array.from(this.templates.values());

    if (filters?.category) {
      templates = templates.filter(t => t.category === filters.category);
    }

    if (filters?.tags && filters.tags.length > 0) {
      templates = templates.filter(t =>
        filters.tags!.some(tag => t.tags.includes(tag)),
      );
    }

    return templates;
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): PromptTemplate | null {
    return this.templates.get(id) || null;
  }

  /**
   * Create custom template
   */
  createTemplate(template: Omit<PromptTemplate, 'id'>): PromptTemplate {
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const fullTemplate: PromptTemplate = {
      id,
      ...template,
    };

    this.templates.set(id, fullTemplate);
    this.logger.log(`Created custom template: ${id}`);

    return fullTemplate;
  }

  /**
   * Render template with variables
   */
  renderTemplate(
    templateId: string,
    variables: Record<string, string>,
  ): string {
    const template = this.templates.get(templateId);
    
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    let rendered = template.template;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
    }

    // Check for missing variables
    const missingVars = rendered.match(/{{(\w+)}}/g);
    if (missingVars) {
      this.logger.warn(`Missing variables in template ${templateId}: ${missingVars.join(', ')}`);
    }

    return rendered;
  }

  /**
   * Optimize prompt quality
   */
  async optimizePrompt(prompt: string): Promise<{
    optimizedPrompt: string;
    metrics: PromptQualityMetrics;
    suggestions: OptimizationSuggestion[];
  }> {
    const metrics = this.analyzePromptQuality(prompt);
    const suggestions = this.generateSuggestions(prompt, metrics);
    const optimizedPrompt = this.applyOptimizations(prompt, suggestions);

    return {
      optimizedPrompt,
      metrics,
      suggestions,
    };
  }

  /**
   * Analyze prompt quality
   */
  private analyzePromptQuality(prompt: string): PromptQualityMetrics {
    const clarity = this.measureClarity(prompt);
    const specificity = this.measureSpecificity(prompt);
    const context = this.measureContext(prompt);
    const instructions = this.measureInstructions(prompt);

    const overall = (clarity + specificity + context + instructions) / 4;

    return {
      clarity,
      specificity,
      context,
      instructions,
      overall,
    };
  }

  /**
   * Measure clarity score
   */
  private measureClarity(prompt: string): number {
    let score = 0.5;

    // Clear structure (paragraphs, lists)
    if (prompt.includes('\n\n') || /^\d+\./.test(prompt)) {
      score += 0.2;
    }

    // Question words for clarity
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who'];
    if (questionWords.some(w => prompt.toLowerCase().includes(w))) {
      score += 0.15;
    }

    // Not too long, not too short
    const wordCount = prompt.split(/\s+/).length;
    if (wordCount >= 10 && wordCount <= 200) {
      score += 0.15;
    }

    return Math.min(score, 1);
  }

  /**
   * Measure specificity score
   */
  private measureSpecificity(prompt: string): number {
    let score = 0.4;

    // Specific keywords
    const specificWords = ['specific', 'detailed', 'exactly', 'precisely', 'particular'];
    if (specificWords.some(w => prompt.toLowerCase().includes(w))) {
      score += 0.2;
    }

    // Numbers and data
    if (/\d+/.test(prompt)) {
      score += 0.2;
    }

    // Constraints or requirements
    const constraintWords = ['must', 'should', 'require', 'need', 'only'];
    if (constraintWords.some(w => prompt.toLowerCase().includes(w))) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  /**
   * Measure context score
   */
  private measureContext(prompt: string): number {
    let score = 0.3;

    // Context keywords
    const contextWords = ['context', 'background', 'given', 'assuming', 'for'];
    if (contextWords.some(w => prompt.toLowerCase().includes(w))) {
      score += 0.3;
    }

    // Examples provided
    if (prompt.toLowerCase().includes('example') || prompt.includes(':')) {
      score += 0.2;
    }

    // Background information
    if (prompt.length > 100) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  /**
   * Measure instructions score
   */
  private measureInstructions(prompt: string): number {
    let score = 0.3;

    // Action verbs
    const actionVerbs = ['generate', 'create', 'write', 'explain', 'analyze', 'provide', 'list'];
    if (actionVerbs.some(v => prompt.toLowerCase().includes(v))) {
      score += 0.3;
    }

    // Output format specified
    const formatWords = ['format', 'json', 'markdown', 'list', 'table', 'bullet'];
    if (formatWords.some(w => prompt.toLowerCase().includes(w))) {
      score += 0.2;
    }

    // Steps or structure
    if (/step|first|then|finally|\d+\./i.test(prompt)) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  /**
   * Generate optimization suggestions
   */
  private generateSuggestions(
    prompt: string,
    metrics: PromptQualityMetrics,
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    if (metrics.clarity < 0.7) {
      suggestions.push({
        type: 'clarity',
        message: 'Add clear structure with numbered steps or bullet points',
        example: '1. First step\n2. Second step',
      });
    }

    if (metrics.specificity < 0.7) {
      suggestions.push({
        type: 'specificity',
        message: 'Add specific details, numbers, or constraints',
        example: 'Generate exactly 5 examples with detailed explanations',
      });
    }

    if (metrics.context < 0.7) {
      suggestions.push({
        type: 'context',
        message: 'Provide more background information or context',
        example: 'Given this context: ... please ...',
      });
    }

    if (metrics.instructions < 0.7) {
      suggestions.push({
        type: 'instructions',
        message: 'Add clear instructions and specify output format',
        example: 'Provide your answer in JSON format with these fields: ...',
      });
    }

    return suggestions;
  }

  /**
   * Apply optimizations to prompt
   */
  private applyOptimizations(
    prompt: string,
    suggestions: OptimizationSuggestion[],
  ): string {
    let optimized = prompt;

    // Add structure if needed
    if (suggestions.some(s => s.type === 'clarity')) {
      if (!optimized.includes('\n\n')) {
        optimized = `Task: ${optimized}\n\nPlease provide a clear and structured response.`;
      }
    }

    // Add specificity
    if (suggestions.some(s => s.type === 'specificity')) {
      if (!optimized.toLowerCase().includes('specific')) {
        optimized += '\n\nBe specific and detailed in your response.';
      }
    }

    // Add context section
    if (suggestions.some(s => s.type === 'context')) {
      if (!optimized.toLowerCase().includes('context')) {
        optimized = `Context: General query\n\n${optimized}`;
      }
    }

    // Add instructions
    if (suggestions.some(s => s.type === 'instructions')) {
      if (!optimized.toLowerCase().includes('format')) {
        optimized += '\n\nProvide your response in a clear, structured format.';
      }
    }

    return optimized;
  }

  /**
   * Execute prompt chain
   */
  async executeChain(steps: ChainStep[]): Promise<{
    results: Array<{ stepId: string; output: string }>;
    executionTime: number;
  }> {
    const startTime = Date.now();
    const results: Array<{ stepId: string; output: string }> = [];
    const outputs = new Map<string, string>();

    // Topological sort for execution order
    const sorted = this.topologicalSort(steps);

    for (const step of sorted) {
      let prompt = step.prompt;

      // Replace dependencies with their outputs
      if (step.dependsOn) {
        for (const depId of step.dependsOn) {
          const depOutput = outputs.get(depId);
          if (depOutput) {
            prompt = prompt.replace(`{{${depId}}}`, depOutput);
          }
        }
      }

      // Simulate execution (in real implementation, call LLM)
      const output = `[Result for: ${prompt.substring(0, 50)}...]`;
      
      outputs.set(step.id, output);
      results.push({ stepId: step.id, output });
    }

    const executionTime = Date.now() - startTime;

    return { results, executionTime };
  }

  /**
   * Topological sort for chain execution
   */
  private topologicalSort(steps: ChainStep[]): ChainStep[] {
    const sorted: ChainStep[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const visit = (step: ChainStep) => {
      if (temp.has(step.id)) {
        throw new Error('Circular dependency detected in prompt chain');
      }
      
      if (visited.has(step.id)) {
        return;
      }

      temp.add(step.id);

      if (step.dependsOn) {
        for (const depId of step.dependsOn) {
          const depStep = steps.find(s => s.id === depId);
          if (depStep) {
            visit(depStep);
          }
        }
      }

      temp.delete(step.id);
      visited.add(step.id);
      sorted.push(step);
    };

    for (const step of steps) {
      if (!visited.has(step.id)) {
        visit(step);
      }
    }

    return sorted;
  }

  /**
   * Generate few-shot examples
   */
  generateFewShotExamples(
    task: string,
    count: number = 3,
  ): Array<{ input: string; output: string }> {
    const examples: Array<{ input: string; output: string }> = [];

    // Generate synthetic examples based on task
    for (let i = 0; i < count; i++) {
      examples.push({
        input: `Example input ${i + 1} for: ${task}`,
        output: `Example output ${i + 1}`,
      });
    }

    return examples;
  }

  /**
   * Search templates
   */
  searchTemplates(query: string): PromptTemplate[] {
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.templates.values()).filter(template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      template.category.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalTemplates: number;
    categoryCounts: Record<string, number>;
    tagCounts: Record<string, number>;
  } {
    const templates = Array.from(this.templates.values());
    
    const categoryCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};

    for (const template of templates) {
      categoryCounts[template.category] = (categoryCounts[template.category] || 0) + 1;
      
      for (const tag of template.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }

    return {
      totalTemplates: templates.length,
      categoryCounts,
      tagCounts,
    };
  }
}
