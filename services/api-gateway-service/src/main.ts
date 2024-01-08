import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionFilter } from './common/filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);

  const port = config.get('app.port');
  const kafkaHost = config.get('microservices.kafka.host');
  const kafkaPort = config.get('microservices.kafka.port');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${kafkaHost}:${kafkaPort}`],
        clientId: 'api-gateway',
      },
      consumer: {
        groupId: 'api-gateway-consumer',
      },
    },
  });

  app.useGlobalFilters(new AllExceptionFilter());
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
