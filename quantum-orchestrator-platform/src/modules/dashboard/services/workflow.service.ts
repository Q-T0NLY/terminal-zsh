import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  async validateWorkflow(workflow: any): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!workflow.name || workflow.name.trim().length === 0) {
      errors.push('Workflow name is required');
    }

    if (!workflow.nodes || workflow.nodes.length === 0) {
      errors.push('Workflow must contain at least one agent node');
    }

    if (workflow.nodes) {
      workflow.nodes.forEach((node: any, index: number) => {
        if (!node.name) errors.push(`Node ${index} is missing a name`);
        if (!node.type) errors.push(`Node ${index} is missing a type`);
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async optimizeWorkflow(workflow: any): Promise<any> {
    const optimized = JSON.parse(JSON.stringify(workflow));

    // Suggest optimizations
    const suggestions = [];

    // Check for parallel execution opportunities
    if (optimized.nodes && optimized.nodes.length > 1) {
      suggestions.push('Consider parallelizing independent nodes for better performance');
    }

    // Check for caching opportunities
    const hasCacheNode = optimized.nodes?.some((n: any) => n.type === 'cache');
    if (!hasCacheNode && optimized.nodes?.length > 2) {
      suggestions.push('Adding a cache node could improve performance by ~20%');
    }

    // Check for error handling
    const hasBreakerNode = optimized.nodes?.some((n: any) => n.type === 'circuit-breaker');
    if (!hasBreakerNode) {
      suggestions.push('Consider adding circuit breaker nodes for resilience');
    }

    return {
      workflow: optimized,
      suggestions,
      estimatedImprovement: suggestions.length * 5
    };
  }

  async generateWorkflowCode(workflow: any): Promise<string> {
    let code = `// Generated Quantum Orchestrator Workflow\n`;
    code += `// Created: ${new Date().toISOString()}\n\n`;
    code += `import { QuantumOrchestrator } from '@quantum/orchestrator';\n\n`;

    code += `const workflow = new QuantumOrchestrator({\n`;
    code += `  name: '${workflow.name}',\n`;
    code += `  nodes: [\n`;

    workflow.nodes?.forEach((node: any) => {
      code += `    {\n`;
      code += `      id: '${node.id}',\n`;
      code += `      name: '${node.name}',\n`;
      code += `      type: '${node.type}',\n`;
      code += `      position: { top: '${node.position?.top}', left: '${node.position?.left}' }\n`;
      code += `    },\n`;
    });

    code += `  ],\n`;
    code += `  connections: ${JSON.stringify(workflow.connections || [], null, 2)}\n`;
    code += `});\n\n`;
    code += `export default workflow;\n`;

    return code;
  }
}
