import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenapiConfig from './shared/openapi/openapi.config';

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await startServer(app);
}

const startServer = async (app: INestApplication): Promise<void> => {
  const configService = app.get(ConfigService);
  const port = configService.get<number>('config.PORT') || 8080;
  const prefix = configService.get<string>('config.PREFIX');
  app.enableCors();
  app.setGlobalPrefix(prefix);
  OpenapiConfig(app);

  await app.listen(port);
};

bootstrap()
  .then((next) => {
    return next;
  })
  .catch((err) => {
    Logger.error(err.message);
  });
