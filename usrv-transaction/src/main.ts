import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${uuidv4()}`,
          brokers: ['localhost:9092'], // to test with more containers to change 'host.docker.internal:9092'
        },
        consumer: {
          groupId: 'transaction-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
