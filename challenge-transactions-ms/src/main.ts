import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const logger = new Logger('FeatureFlag API');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: { origin: '*' },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: process.env.GROUP_ID,
      },
      client: {
        brokers: [process.env.BROKER],
      },
    },
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  //helmet
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('App Challenge Yape')
    .setDescription(
      'API Challenge Yape for transaction validation with kafka..',
    )
    .setVersion('1.0');

  if ('LOCAL' !== AppService.environment) {
    configSwagger.addServer(`/${AppService.stage}/challenge-yape`);
  }

  const document = SwaggerModule.createDocument(app, configSwagger.build(), {
    operationIdFactory: (controlKey: string, methodKey: string) => methodKey,
  });
  const documentOptions = {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  };
  SwaggerModule.setup('api', app, document, documentOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(AppModule.port, '0.0.0.0', () => {
    logger.log(`🚀 Application is running on port: ${AppModule.port}`);
  });
}
bootstrap();
