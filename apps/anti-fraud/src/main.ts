import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AntiFraudModule } from './anti-fraud.module';

async function bootstrap() {
  const app = await NestFactory.create(AntiFraudModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('ANTI_FRAUD_PORT');

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        // brokers: [configService.get<string>('KAFKA_BROKER_URL')],
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await microservice.listen();
  await app.listen(port);

  Logger.log(`Anti-Fraud service is running on: http://localhost:${port}`);
}
bootstrap();
