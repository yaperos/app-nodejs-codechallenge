import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`Running in port ${process.env.BACKEND_PORT}`)
  await app.listen(process.env.BACKEND_PORT);
}
bootstrap();
