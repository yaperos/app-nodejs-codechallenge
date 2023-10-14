import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app
    .listen(configService.get('APP_PORT') || 3000)
    .then(() =>
      Logger.log(
        `Server running on port ${configService.get('APP_PORT')}`,
        'Bootstrap',
      ),
    );
}
bootstrap();
