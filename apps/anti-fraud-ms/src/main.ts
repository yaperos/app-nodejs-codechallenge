import { NestFactory } from '@nestjs/core';
import { AntiFraudMsModule } from './anti-fraud-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudMsModule);
  await app.listen(3000);
}
bootstrap();
