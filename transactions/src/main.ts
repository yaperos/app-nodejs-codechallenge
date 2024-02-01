import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { DefaultExceptionFilter } from './default-Exception.filter';
const port = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new DefaultExceptionFilter(),
  );

  const kafka =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: `consumer-${uuidv4()}`,
            brokers: [
              process.env.KAFKA_BROKER ||
                'localhost:9092',
            ],
          },
          consumer: {
            groupId: 'transactions-consumer',
          },
        },
      },
    );

  app.listen(port).catch((err) => {
    if (err.code === 'EADDRINUSE') {
      // eslint-disable-next-line prettier/prettier
        console.error(`Port ${port} is already in use, trying port ${port + 1}`);
      app.listen(port + 1);
    } else {
      throw err;
    }
  });
  await kafka.listen();
}
bootstrap();
