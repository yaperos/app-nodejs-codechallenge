import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { buildBanner } from './shared/infrastructure/config/app.config';
import { buildDocument } from './shared/infrastructure/config/swagger.config';
import { KafkaConfigService } from './shared/infrastructure/broker/kafka/config/broker.config.service';
import { CatchAllErrorsFilter } from './shared/infrastructure/errors/catch-all-errors.filter';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const config = app.get(ConfigService);

  const appConfig = config.get('app');
  app.setGlobalPrefix(appConfig.baseContextPath);

  const swaggerConfig = config.get('swagger');
  SwaggerModule.setup(
    `${appConfig.baseContextPath + swaggerConfig.path}`,
    app,
    buildDocument(app, config),
  );

  KafkaConfigService.inicialize(app);

  app.useGlobalFilters(new CatchAllErrorsFilter());
  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(appConfig.port, appConfig.host);
  logger.log(buildBanner(config));
}
bootstrap();
