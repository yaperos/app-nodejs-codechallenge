import { NestFactory } from '@nestjs/core';
import { AntiFraudSystemModule } from './anti-fraud-system.module';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudSystemModule);
  await app.listen(3000);
}
bootstrap();
