import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setApplicationConfig } from './config/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setApplicationConfig(app);
  await app.listen(3000);
  Logger.log(`Server running on port ${process.env.PORT}`, 'Bootstrap');
}
bootstrap();
