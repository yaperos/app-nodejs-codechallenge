import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT_TRANSACTION');

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: { fromBeginning: true },
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'transaction-group',
        },
        run: {
          autoCommit: false,
        },
      },
    },
  } as MicroserviceOptions);

  app.startAllMicroservices();

  await app.listen(port);
}
bootstrap();
