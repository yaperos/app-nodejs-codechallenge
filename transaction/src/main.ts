import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:29092'],
      },
      consumer: {
        groupId: 'transaction-update',
      },
    },
  });

  const dataSource = app.get(DataSource)
  await dataSource.synchronize();
  await dataSource.runMigrations();
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
