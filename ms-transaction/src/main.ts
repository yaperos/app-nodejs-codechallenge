import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setApplicationConfig, startAllMicroservices } from './config/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setApplicationConfig(app);
  await startAllMicroservices(app);

  await app.listen(process.env.PORT);
  Logger.log(`Server running on port ${process.env.PORT}`);
}
bootstrap();
