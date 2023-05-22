/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

 import { Logger, ValidationPipe } from '@nestjs/common';
 import { NestFactory } from '@nestjs/core';
 import { MicroserviceOptions, Transport } from '@nestjs/microservices';
 import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'trans-consumer'
        }
      }
  } as MicroserviceOptions);

  const config = new DocumentBuilder()
    .setTitle('Transactions API')
    .setDescription('The transactions API description')
    .setVersion('1.0')
    .addTag('transactions')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
