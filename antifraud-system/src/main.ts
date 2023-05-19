import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);
  await app.listen(4000);
}
bootstrap();
