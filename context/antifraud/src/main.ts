import { AntifraudModule } from "./antifraud.module";
import { Logger } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntifraudModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.KAFKA_CLIENT_ID,
          brokers: [process.env.KAFKA_BROKER],
        },
        consumer: {
          groupId: process.env.ANTIFRAUD_GROUP_ID,
        },
      },
    },
  );
  await app.listen();
  Logger.log(`Application only lives in Kafka`);
}
bootstrap();
