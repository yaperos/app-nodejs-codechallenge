/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  await app.startAllMicroservices();
  await app.listen(3003);
  console.log("START FINANCIAL-TRANSACTIONS IN PORT 3003")
}
bootstrap();
