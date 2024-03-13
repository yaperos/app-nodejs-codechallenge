import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './infraestructure/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceConfig } from './infraestructure/microservice/microservice';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(`Yape ${serverConfig.name}`)
    .setDescription(`Microservice to ${serverConfig.name} in yape application`)
    .setVersion('1.0')
    .addTag(serverConfig.name)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.connectMicroservice(MicroserviceConfig);

  await app.startAllMicroservices();

  await app.listen(serverConfig.port, () => {
    Logger.log(
      `Server is running on port ${serverConfig.port}, ${serverConfig.name}`,
    );
  });
}

bootstrap();
