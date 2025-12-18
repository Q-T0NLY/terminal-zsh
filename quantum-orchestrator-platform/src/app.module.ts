import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AgentModule } from './modules/agent/agent.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SecurityModule } from './modules/security/security.module';
import { RegistryModule } from './registry/registry.module';
import { MeshModule } from './mesh/mesh.module';
import { FrameworksModule } from './frameworks/frameworks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'quantum',
      password: process.env.DB_PASSWORD || 'quantum',
      database: process.env.DB_NAME || 'quantum_orchestrator',
      entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      autoLoadEntities: true,
    }),
    DashboardModule,
    AgentModule,
    IntegrationModule,
    NotificationModule,
    AnalyticsModule,
    SecurityModule,
    RegistryModule,
    MeshModule,
    FrameworksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
