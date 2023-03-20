import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions,Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        // brokers:[`${ process.env.KAFKA_HOST }:9092`]
        brokers: ['localhost:9092']
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
      }
    }
  } as MicroserviceOptions);
  app.enableCors();
  await app.listen(3000);
}

bootstrap();