import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { KafkaConfigService } from './config/kafka-config.service';
import {
  TRANSACTION_API_DESCRIPTION_SWAGGER,
  TRANSACTION_API_TAG_SWAGGER,
  TRANSACTION_API_TITLE_SWAGGER,
  TRANSACTION_API_VERSION_SWAGGER,
} from './constants/app.constants';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  KafkaConfigService.connectKafka(app);
  app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle(TRANSACTION_API_TITLE_SWAGGER)
    .setDescription(TRANSACTION_API_DESCRIPTION_SWAGGER)
    .setVersion(TRANSACTION_API_VERSION_SWAGGER)
    .addTag(TRANSACTION_API_TAG_SWAGGER)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
