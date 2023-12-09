import { NestFactory } from '@nestjs/core';
import { MsAntifraudModule } from './ms-antifraud.module';

async function bootstrap() {
  const app = await NestFactory.create(MsAntifraudModule);
  await app.listen(3000);
}
bootstrap();
