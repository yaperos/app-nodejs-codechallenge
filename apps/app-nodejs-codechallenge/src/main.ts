import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice({
    name: "KAFKA_SERVICE_YAPE",
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: "kafka-main",
      },
      client: {
        clientId: "main-transaction",
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

  const port = configService.get<number>("APP_PORT", 3000);

  await app.listen(port);
  Logger.log(`Run app in http://localhost:${port}/`);
};

(async () => {
  await bootstrap();
})();
