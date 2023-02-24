import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfig } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  await app.listen(EnvConfig.port());

  Logger.log(
    `App is running on port ${EnvConfig.port()} in ${EnvConfig.environment()} mode. Press CTRL-C to stop.`,
  );
}
bootstrap();
