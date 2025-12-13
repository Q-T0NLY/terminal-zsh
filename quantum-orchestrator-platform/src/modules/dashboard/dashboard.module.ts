import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { KPIService } from './services/kpi.service';
import { WorkflowService } from './services/workflow.service';
import { AgentService } from './services/agent.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, KPIService, WorkflowService, AgentService],
  exports: [DashboardService, KPIService, WorkflowService, AgentService],
})
export class DashboardModule {}
