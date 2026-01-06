import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startAntifraudConsumer } from './kafka/antifraud.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await startAntifraudConsumer();
}
bootstrap();