import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MAIN_CONSUMER_GROUP, MAIN_SERVICE_NAME } from './app.constants';

async function bootstrap() {
  const configService = new ConfigService();
  const brokers = [`${configService.get('KAFKA_BROKER')}`];

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: MAIN_SERVICE_NAME,
        brokers
      },
      consumer: {
        groupId: MAIN_CONSUMER_GROUP,
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Yape test')
    .setDescription('technical challenge for yape')
    .setVersion('1.0')
    .setBasePath('api')
    .addTag('yape')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  const port = app.get(ConfigService).get<number>('PORT') || 3002;
  await app.listen(port);
}
bootstrap();
