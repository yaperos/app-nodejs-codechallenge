import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config(); // Asegúrate de que dotenv se configure antes de cualquier otra operación


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3005);
}
bootstrap();
