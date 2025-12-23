import { Module } from '@nestjs/common';
import { AdvancedAIController } from './advanced-ai.controller';
import { DAGRAGEngine } from './dag-rag/DAGRAGEngine';
import { DAGRAGPlugin } from './dag-rag/DAGRAGPlugin';
import { PromptToolkit } from './prompt-toolkit/PromptToolkit';
import { PromptToolkitPlugin } from './prompt-toolkit/PromptToolkitPlugin';
import { ContextNLPFusion } from './nlp-fusion/ContextNLPFusion';
import { ContextNLPFusionPlugin } from './nlp-fusion/ContextNLPFusionPlugin';

@Module({
  controllers: [AdvancedAIController],
  providers: [
    // Core engines
    DAGRAGEngine,
    PromptToolkit,
    ContextNLPFusion,
    // Plugin wrappers
    DAGRAGPlugin,
    PromptToolkitPlugin,
    ContextNLPFusionPlugin,
  ],
  exports: [
    // Export both engines and plugins for flexibility
    DAGRAGEngine,
    PromptToolkit,
    ContextNLPFusion,
    DAGRAGPlugin,
    PromptToolkitPlugin,
    ContextNLPFusionPlugin,
  ],
})
export class AdvancedAIModule {}
