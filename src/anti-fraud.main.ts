import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AntiFraudModule, {
    logger: ['error', 'warn', 'log'],
  });
  await app.init();
}

void bootstrap();
