import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_SERVER],
          ssl: true,
          sasl: {
            mechanism: 'plain',
            username: process.env.KAFKA_KEY,
            password: process.env.KAFKA_SECRET,
          },
        },
        consumer: {
          groupId: 'kafka-consumer-antif', // Should be the same thing we give in consumer
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
