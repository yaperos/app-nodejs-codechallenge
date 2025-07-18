// ✅ Cargar variables de entorno desde .env
import * as dotenv from 'dotenv';
dotenv.config();

// ✅ Silenciar warning de KafkaJS partitioner
process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

/**
 * Bootstrap function equivalent to Spring Boot main method
 * Configures the application using .env configuration
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configuration values from .env file
  const applicationName = configService.get<string>('application.name') || 'business-transaction-anti-fraud';
  const serverPort = configService.get<number>('application.server.port') || 8082;
  const basePath = configService.get<string>('application.server.basePath') || '/transaction-anti-fraud/v1';
  
  // Kafka configuration from .env
  const kafkaBrokers = configService.get<string[]>('kafka.bootstrapServers') || ['localhost:19092'];
  const consumerGroupId = configService.get<string>('kafka.consumer.groupId') || 'reactive-group';

  // Set global prefix
  app.setGlobalPrefix(basePath);

  // Start only the HTTP application - Kafka is handled by ReactiveKafkaConsumer/Producer services
  await app.listen(serverPort);

  logger.log(`🚀 Application ${applicationName} is running on: http://localhost:${serverPort}${basePath}`);
  logger.log(`📡 Kafka brokers: ${kafkaBrokers.join(', ')}`);
  logger.log(`👥 Consumer group: ${consumerGroupId}`);
}

bootstrap().catch(error => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});