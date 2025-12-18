import { Module } from '@nestjs/common';
import { FrameworksController } from './frameworks.controller';
import { LangGraphPlugin } from './langgraph/LangGraphPlugin';
import { StateManager } from './langgraph/StateManager';
import { LlamaIndexPlugin } from './llamaindex/LlamaIndexPlugin';
import { CrewAIPlugin } from './crewai/CrewAIPlugin';
import { AgentManager } from './crewai/AgentManager';
import { TaskExecutor } from './crewai/TaskExecutor';

@Module({
  controllers: [FrameworksController],
  providers: [
    // LangGraph
    StateManager,
    LangGraphPlugin,
    // LlamaIndex
    LlamaIndexPlugin,
    // CrewAI
    AgentManager,
    TaskExecutor,
    CrewAIPlugin
  ],
  exports: [
    LangGraphPlugin,
    LlamaIndexPlugin,
    CrewAIPlugin
  ]
})
export class FrameworksModule {}
