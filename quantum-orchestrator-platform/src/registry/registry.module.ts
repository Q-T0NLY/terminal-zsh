import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversalRegistry } from './UniversalRegistry';
import { PluginStorage } from './PluginStorage';
import { PluginValidator } from './PluginValidator';
import { PluginLoader } from './PluginLoader';
import { RegistryController } from './registry.controller';
import { PluginEntity } from '../entities/plugin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PluginEntity])],
  controllers: [RegistryController],
  providers: [
    UniversalRegistry,
    PluginStorage,
    PluginValidator,
    PluginLoader,
  ],
  exports: [
    UniversalRegistry,
    PluginStorage,
    PluginValidator,
    PluginLoader,
  ],
})
export class RegistryModule {}
