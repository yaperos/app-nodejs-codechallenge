import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';

// Sin HTTP: el servicio solo habla por Kafka.
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AntiFraudModule);
  app.enableShutdownHooks();
}
void bootstrap();
