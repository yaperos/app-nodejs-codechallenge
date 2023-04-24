import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './config/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { json, raw, urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';
import { KafkaDecoratorProcessorService } from '@/config/bus/kafka/kafkaProcessor/KafkaDecoratorProcessorService';
import { Transport } from '@nestjs/microservices';
import { AntifraudController } from '@/contexts/antifraud/antifraud.controller';

async function bootstrap() {
  const logger = new LoggerService();

  const app = await NestFactory.create(AppModule, {
    logger,
  });
  const configService = app.get(ConfigService);
  const requestLimit = configService.get('BODY_SIZE_LIMIT') || '50mb';
  app.use(json({ limit: requestLimit }));
  app.use(urlencoded({ extended: true, limit: requestLimit }));
  app.use(raw({ limit: requestLimit }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const kaf = app.get(KafkaDecoratorProcessorService);
  await kaf.processKafkaDecorators([AntifraudController]);
  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT);

  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: await configService.get('ANTI_FRAUD_KAFKA_CLIENT_ID'),
          brokers: (await configService.get('KAFKA_BROKERS')).split(','),
        },
        consumer: {
          groupId: await configService.get('ANTI_FRAUD_KAFKA_GROUP_ID'),
        },
      },
    },
    { inheritAppConfig: true },
  );
  logger.log(`app running on port: ${PORT}`);

  await app.startAllMicroservices();
}
bootstrap();
