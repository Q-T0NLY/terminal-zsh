import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRegistry } from './ServiceRegistry';
import { ServiceMesh } from './ServiceMesh';
import { MeshTopology } from './MeshTopology';
import { MeshController } from './mesh.controller';
import { ServiceEntity } from '../entities/service.entity';
import { RegistryModule } from '../registry/registry.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity]),
    RegistryModule,
  ],
  controllers: [MeshController],
  providers: [ServiceRegistry, ServiceMesh, MeshTopology],
  exports: [ServiceRegistry, ServiceMesh, MeshTopology],
})
export class MeshModule {}
