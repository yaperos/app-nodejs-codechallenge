import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'antifraud-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
  console.log(`MicroServices is listening on: ${await app.getUrl()}`);
}
bootstrap();
