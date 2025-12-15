import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKERS || 'localhost:29092'],
        },
        consumer: {
          groupId: 'anti-fraud-consumer',
        },
      },
    },
  );
  
  
  await app.listen();
  console.log('Anti-Fraud Microservice is listening via Kafka...');
}
bootstrap();