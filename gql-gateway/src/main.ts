/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  await app.startAllMicroservices();
  await app.listen(3001);
  console.log("START GQL-GATEWAY IN PORT 3000")
}
bootstrap();
