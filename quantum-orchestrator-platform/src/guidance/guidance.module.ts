import { Module } from '@nestjs/common';
import { GuidanceEngine } from './GuidanceEngine';
import { GuidancePlugin } from './GuidancePlugin';
import { GuidanceController } from './guidance.controller';

@Module({
  controllers: [GuidanceController],
  providers: [GuidanceEngine, GuidancePlugin],
  exports: [GuidanceEngine, GuidancePlugin],
})
export class GuidanceModule {}
