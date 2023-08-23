import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

process.env.KAFKAJS_NO_PARTITIONER_WARNING = '1';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        consumer: {
          groupId: process.env.GROUP_ID,
        },
        client: {
          brokers: [process.env.BROKER],
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
