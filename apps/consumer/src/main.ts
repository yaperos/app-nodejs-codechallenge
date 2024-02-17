import { NestFactory } from "@nestjs/core";
import ConsumerModule from "./consumer.module";
import { Logger } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";
import { ConfigService } from "@nestjs/config";

const bootstrap = async () => {
  const app = await NestFactory.create(ConsumerModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice({
    name: "KAFKA_SERVICE_YAPE",
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: "kafka-consumer",
      },
      client: {
        clientId: "process-transaction",
        brokers: [configService.get<string>("KAFKA_HOST")],
        // -------> In local not required others properties
        // ssl: true,
        // sasl: {
        //   mechanism: 'plain',
        //   username: configService.get<string>('KAFKA_USER'),
        //   password: configService.get<string>('KAFKA_PASSWORD'),
        // },
      },
      producer: {
        createPartitioner: Partitioners.DefaultPartitioner,
      },
    },
  } as MicroserviceOptions);

  await app.startAllMicroservices();

  Logger.log("Run consumer!");
};

(async () => {
  await bootstrap();
})();
