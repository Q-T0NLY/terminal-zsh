import { Module } from '@nestjs/common';
import { AdvancedAIController } from './advanced-ai.controller';
import { DAGRAGEngine } from './dag-rag/DAGRAGEngine';
import { PromptToolkit } from './prompt-toolkit/PromptToolkit';
import { ContextNLPFusion } from './nlp-fusion/ContextNLPFusion';

@Module({
  controllers: [AdvancedAIController],
  providers: [
    DAGRAGEngine,
    PromptToolkit,
    ContextNLPFusion,
  ],
  exports: [
    DAGRAGEngine,
    PromptToolkit,
    ContextNLPFusion,
  ],
})
export class AdvancedAIModule {}
