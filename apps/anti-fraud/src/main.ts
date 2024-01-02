import { NestFactory } from "@nestjs/core";
import { AntiFraudModule } from "./app/anti-fraud.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { MICROSERVICES_CONSTANTS } from "@yape-transactions/shared";

// default: localhost:9092
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers,
        },
        consumer: {
          groupId: MICROSERVICES_CONSTANTS.ANTI_FRAUD_MICROSERVICE.groupId,
        },
      },
    }
  );
  await app.listen();
}

bootstrap();
