import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from "./config/logger/logger.service";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KafkaDecoratorProcessorService } from "./config/bus/kafka/kafkaProcessor/KafkaDecoratorProcessorService";
import { AntifraudController } from "./contexts/antifraud/antifraud.controller";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const logger = new LoggerService();
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  await app.init();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const kaf = app.get(KafkaDecoratorProcessorService);
  await kaf.processKafkaDecorators([AntifraudController]);
  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT);

  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: await configService.get('TRANSACTION_KAFKA_CLIENT_ID'),
          brokers: (await configService.get('KAFKA_BROKERS')).split(','),
        },
        consumer: {
          groupId: await configService.get('TRANSACTION_KAFKA_GROUP_ID'),
        },
      },
    },
    { inheritAppConfig: true },
  );
  logger.log(`app running on port: ${PORT}`);

  await app.startAllMicroservices();
}
bootstrap();
