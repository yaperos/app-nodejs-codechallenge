import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'ms-transactions',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transactions-group',
      },
      run: {
        autoCommit: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
