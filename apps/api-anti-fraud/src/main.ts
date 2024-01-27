import { NestFactory } from '@nestjs/core';
import { ApiAntiFraudModule } from './api-anti-fraud.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiAntiFraudModule);
  await app.listen(3000);
}
bootstrap();
