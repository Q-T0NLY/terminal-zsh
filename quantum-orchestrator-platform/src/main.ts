import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger('Bootstrap');

  // Global middleware
  app.use(cors());
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // API Documentation
  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  logger.log(`🚀 Quantum Orchestrator Platform running on http://localhost:${PORT}`);
  logger.log(`📊 Dashboard available at http://localhost:${PORT}/dashboard`);
  logger.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}`);
  logger.log(`📚 API Docs: http://localhost:${PORT}/api`);
}

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
