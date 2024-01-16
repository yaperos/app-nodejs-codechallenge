import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKERS],
          logLevel: 0,
        },
        consumer: {
          groupId: process.env.KAFKA_GROUP_UD,
          sessionTimeout: 30000,
          heartbeatInterval: 10000,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
