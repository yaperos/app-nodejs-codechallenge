import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKERCONNECT],
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_ID,
      },
    },
  } as MicroserviceOptions);

  const config = new DocumentBuilder()
    .setTitle('Transactions API')
    .setDescription('Transactions API Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.NODE_PORT);
}
bootstrap();
