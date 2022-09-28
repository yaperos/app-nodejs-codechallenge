import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppService } from './app.service';
import { APP_PORT } from './infrastructure/constants';
import { TransactionModule } from './transaction.module';

function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Transaction Doc')
    .setDescription('Transaction Doc')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/v1', app, document);
}
async function bootstrap() {
  const config = AppService.KafkaConfig();
  const app = await NestFactory.create(TransactionModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.brokers,
      },
      consumer: {
        groupId: config.groupId,
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);

  await app.startAllMicroservices();
  await app.listen(APP_PORT);
}

bootstrap();
