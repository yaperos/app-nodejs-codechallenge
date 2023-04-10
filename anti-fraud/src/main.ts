import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { sleep } from 'utils';

async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.KAFKA,
        options: {
          subscribe: {
            fromBeginning: true,
          },
          consumer: {
            groupId: 'transactions',
          },
          client: {
            brokers: ['kafka:29092'],
          },
        },
      },
    );

    app.listen();
  } catch (error) {
    console.error(error);
    await sleep(5000);
    this.bootstrap();
  }
}

bootstrap();
