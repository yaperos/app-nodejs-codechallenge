import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {

  dotenv.config();

  const app = await NestFactory.create(AppModule);
  await app.listen(8082);
}
bootstrap();