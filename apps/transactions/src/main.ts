import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { KafkaConfig } from '@/config/kafka.config';
import { SwaggerConfig } from '@/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const kafkaOptions = KafkaConfig.getOptions(configService);
  app.connectMicroservice<MicroserviceOptions>(kafkaOptions);
  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());
  SwaggerConfig.setup(app);
  await app.listen(configService.get<string>('APP_PORT'));
}
bootstrap();
