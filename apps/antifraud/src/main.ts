import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  await NestFactory.createApplicationContext(AppModule);
  logger.log('Nest application successfully started');
}
bootstrap();
