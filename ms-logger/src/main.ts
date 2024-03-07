import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './infraestructure/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(serverConfig.port, () => {
    Logger.log(
      `Server is running on port ${serverConfig.port}, ${serverConfig.name}`,
    );
  });
}

bootstrap();
