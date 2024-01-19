import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA, 
    options: {
      client: {
        brokers: ['localhost:9092']
      },
      consumer: {
        groupId: 'transaction-consumer'
      }
    }
  } as MicroserviceOptions);

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
