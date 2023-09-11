import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule } from '@nestjs/swagger';

import { config } from 'dotenv';
config();

// import { ValidationPipe } from '@nestjs/common'; 
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { buildBanner } from './config/app.config';
import { buildDocument } from './config/swagger.config';



import { Logger } from '@nestjs/common';

async function bootstrap() {

  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  });

  const config = app.get(ConfigService);

  const appConfig = config.get('app');
  app.setGlobalPrefix(appConfig.baseContextPath);

  const swaggerConfig = config.get('swagger');

  SwaggerModule.setup(`${appConfig.baseContextPath + swaggerConfig.path}`, app, buildDocument(app, config));

  const kafkaConfig = config.get('kafka');

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: {
        fromBeginning: true
      },
      client: {
        clientId: 'yape-transactions-ms-client',
        brokers: [`${kafkaConfig.host}:${kafkaConfig.port}`]
      },
      consumer: {
        groupId: 'yape-transactions-ms-consumer'
      },
    }
  });
  await app.startAllMicroservices();

  await app.listen(appConfig.port, appConfig.host);
  logger.log(buildBanner(config));
}
bootstrap();
