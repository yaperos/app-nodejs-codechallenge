import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERS || 'localhost:29092'],
      },
      consumer: {
        groupId: 'transaction-consumer-server', 
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('Transaction Service is running on port 3000 and listening to Kafka');
}
bootstrap();