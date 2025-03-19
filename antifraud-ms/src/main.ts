import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'anti-fraud-service-group',
        },
      },
    },
  );


  await app.listen();
  console.log('Anti-Fraud Microservice is listening for Kafka messages...');
}


export const handler = async () => {
  await bootstrap();
};
