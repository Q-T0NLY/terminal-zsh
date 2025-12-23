import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversalRegistry } from './UniversalRegistry';
import { PluginStorage } from './PluginStorage';
import { PluginValidator } from './PluginValidator';
import { PluginLoader } from './PluginLoader';
import { RegistryController } from './registry.controller';
import { PluginRegistryInitializer } from './PluginRegistryInitializer';
import { PluginEntity } from '../entities/plugin.entity';
import { FrameworksModule } from '../frameworks/frameworks.module';
import { AdvancedAIModule } from '../advanced-ai/advanced-ai.module';
import { GuidanceModule } from '../guidance/guidance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PluginEntity]),
    FrameworksModule,
    AdvancedAIModule,
    GuidanceModule,
  ],
  controllers: [RegistryController],
  providers: [
    UniversalRegistry,
    PluginStorage,
    PluginValidator,
    PluginLoader,
    PluginRegistryInitializer,
  ],
  exports: [
    UniversalRegistry,
    PluginStorage,
    PluginValidator,
    PluginLoader
  ]
})
export class RegistryModule {}
