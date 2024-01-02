import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { MICROSERVICES_CONSTANTS } from "@yape-transactions/shared";

// default: localhost:9092
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers,
        },
        consumer: {
          groupId: MICROSERVICES_CONSTANTS.TRANSFER_MANAGER_MICROSERVICE.groupId,
        },
      },
    }
  );
  await app.listen();
}

bootstrap();
