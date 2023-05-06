import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI
  });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {      
      client: {
        clientId: 'transactions',
        brokers: ['host.docker.internal:9092'],
      },
      consumer: {
        groupId: 'transactions-retrieve-consumer',
      }
    }
  } as MicroserviceOptions);

  const config = new DocumentBuilder()
  .setTitle('Transactions API')
  .setDescription('Transactions API Description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
