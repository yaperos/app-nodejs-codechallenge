import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('AntiFraudService');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Anti-Fraud service running on port ${port}`);
}
bootstrap();
