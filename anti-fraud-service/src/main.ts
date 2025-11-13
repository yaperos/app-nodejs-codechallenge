import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });

  const logger = new Logger('AntiFraudBootstrap');
  app.useLogger(logger);
  logger.log('Anti-fraud service started');
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap anti-fraud service', error);
  process.exit(1);
});
