import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';
import { KafkaService } from '@app/kafka';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  const kafkaService = app.get(KafkaService);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>(
    kafkaService.getOptions('TRANSACTION_SERVICE'),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));

  Logger.log(`Transaction service running on ${configService.get('URL')}`);
}
bootstrap();
