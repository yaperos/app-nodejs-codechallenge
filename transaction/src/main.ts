import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('');
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      subscribe: { fromBeginning: true },
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'transacion_group' },
    },
  } as MicroserviceOptions);

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
