import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
