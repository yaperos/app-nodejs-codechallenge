import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'fraud-detection',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'fraud-detection-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3002);
}

void bootstrap();
