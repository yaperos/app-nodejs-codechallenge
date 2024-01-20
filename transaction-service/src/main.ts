import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { kafkaConfig } from './config/kafka.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.connectMicroservice<MicroserviceOptions>(
    kafkaConfig(configService),
  );

  await app.startAllMicroservices();
  // Si también necesitas iniciar un servidor HTTP, puedes hacerlo aquí.
  await app.listen(3000);
}

bootstrap();
