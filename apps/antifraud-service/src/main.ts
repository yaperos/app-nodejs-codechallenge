import 'config/env.config';
import { NestFactory } from '@nestjs/core';
import { AntifraudModule } from './antifraud-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AntifraudModule, {});

  await app.startAllMicroservices();
  await app.listen(process.env.ANTIFRAUD_SERVICE_PORT);
}
bootstrap();
