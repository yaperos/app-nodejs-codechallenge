import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './infraestructure/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Yape - MS TRANSACTIONS')
    .setDescription('Microservice to transactions in yape application')
    .setVersion('1.0')
    .addTag('ms-transactions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(serverConfig.port, () => {
    Logger.log(
      `Server is running on port ${serverConfig.port}, ${serverConfig.name}`,
    );
  });
}

bootstrap();
