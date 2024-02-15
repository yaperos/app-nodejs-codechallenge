import { NestFactory } from "@nestjs/core";
import ConsumerModule from "./consumer.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";

const bootstrap = async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConsumerModule,
    {
      transport: Transport.TCP,
    },
  );
  Logger.log("Run consumer!");
  await app.listen();
};

(async () => {
  await bootstrap();
})();
