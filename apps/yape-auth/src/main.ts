import { NestFactory } from '@nestjs/core';
import { YapeAuthModule } from './yape-auth.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      YapeAuthModule,
      {
          transport: Transport.TCP,
          options: {
              host: 'localhost',
              port: 8081,
          }
      }
  );
  await app.listen();
}
bootstrap();
