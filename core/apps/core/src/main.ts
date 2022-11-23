import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {Transport} from '@nestjs/microservices';
import { KafkaEnum } from 'apps/shared/enum/kafka-config.enum';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
      .setTitle('CODECHALLENGE')
      .setDescription('The CODECHALLENGE API descricion')
      .setVersion('1.0')
      .addTag('code')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
