import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const port = process.env.PORT || 3001;
  // const app = await NestFactory.create(AppModule);
  // await app.listen(port);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
          clientId: 'antifraud1',
          logLevel: 4,
        },
        consumer: {
          groupId: 'anti-frauds-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
