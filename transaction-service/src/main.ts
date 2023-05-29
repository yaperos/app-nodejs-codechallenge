import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';

import fastify from 'fastify';

import { AppModule } from './app.module';
import { swaggerConfig } from './config';

import { TypesSeed } from './adapters/database/mongo/types/types.seed';
import { TypesService } from './modules/types/types.service';

async function bootstrap() {
  const fastifyInstance = fastify({
    logger: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
    { cors: true },
  );

  const typesService = app.get(TypesService);
  const existTransactionTypes = await typesService.existTransactionTypes();
  if (!existTransactionTypes) {
    const typesSeed = app.get(TypesSeed);
    await typesSeed.seedData();
    Logger.log('Seeding completed successfully.');
  }

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(AppModule.port, '0.0.0.0');
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
