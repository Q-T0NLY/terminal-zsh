import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRegistry } from './ServiceRegistry';
import { ServiceMesh } from './ServiceMesh';
import { MeshTopology } from './MeshTopology';
import { MeshController } from './mesh.controller';
import { ServiceMeshInitializer } from './ServiceMeshInitializer';
import { ServiceEntity } from '../entities/service.entity';
import { RegistryModule } from '../registry/registry.module';
import { FrameworksModule } from '../frameworks/frameworks.module';
import { AdvancedAIModule } from '../advanced-ai/advanced-ai.module';
import { GuidanceModule } from '../guidance/guidance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity]),
    RegistryModule,
    FrameworksModule,
    AdvancedAIModule,
    GuidanceModule,
  ],
  controllers: [MeshController],
  providers: [
    ServiceRegistry,
    ServiceMesh,
    MeshTopology,
    ServiceMeshInitializer,
  ],
  exports: [
    ServiceRegistry,
    ServiceMesh,
    MeshTopology
  ]
})
export class MeshModule {}
