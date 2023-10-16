import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import {config} from "dotenv";

config();
const configService = new ConfigService();

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [configService.get('KAFKA_BROKER')],
          },
        },
      },
    );

  await app.listen();
  logger.verbose('Kafka consumer service is listening!');
}
bootstrap();
