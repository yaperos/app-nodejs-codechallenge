import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './common/utils/setup-swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_BROKER')],
      },
      consumer: {
        groupId: configService.get('KAFKA_CONSUMER'),
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  setupSwagger(app);

  await app.startAllMicroservices();
  await app.listen(4000);
  const url = await app
    .getUrl()
    .then((url) =>
      url.includes('[::1]') ? url.replace('[::1]', 'localhost') : url,
    );
  logger.verbose(`Server is running on ${url}`);
}
bootstrap();
