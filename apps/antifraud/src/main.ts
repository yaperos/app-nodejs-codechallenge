import { NestFactory } from '@nestjs/core';
import { AntifraudModule } from './antifraud.module';

async function bootstrap() {
  const app = await NestFactory.create(AntifraudModule);
  await app.listen(3000);
}
bootstrap();
