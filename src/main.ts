import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('YAPE Transaction Service')
    .setDescription('High-performance transaction processing service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('transactions', 'Transaction operations')
    .addTag('health', 'Health check endpoints')
    .addTag('metrics', 'Metrics and monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const kafkaBrokers = configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',');
  const kafkaClientId = configService.get<string>('KAFKA_CLIENT_ID', 'yape-transaction-service');
  const kafkaGroupId = configService.get<string>('KAFKA_CONSUMER_GROUP_ID', 'yape-transaction-group');

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: kafkaClientId,
        brokers: kafkaBrokers,
        retry: {
          initialRetryTime: 100,
          retries: 8,
        },
      },
      consumer: {
        groupId: kafkaGroupId,
        allowAutoTopicCreation: true,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxBytesPerPartition: 1048576,
      },
      subscribe: {
        fromBeginning: false,
      },
    },
  });

  await app.startAllMicroservices();

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`
    🚀 YAPE Transaction Service is running!
    📍 HTTP Server: http://localhost:${port}
    📚 API Documentation: http://localhost:${port}/docs
    🎯 API Prefix: /${apiPrefix}
    📊 Kafka Brokers: ${kafkaBrokers.join(', ')}
    🔄 Environment: ${configService.get('NODE_ENV', 'development')}
  `);

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await app.close();
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});