import { NestFactory } from '@nestjs/core';
import { YapeTransactionModule } from './yape-transaction.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      YapeTransactionModule,
      {
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 8082,
        }
      }
  )
  await app.listen();
}
bootstrap();
