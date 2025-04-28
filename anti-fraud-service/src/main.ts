import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { kafkaConfig } from "./kafka.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(kafkaConfig);

  await app.listen(3005);
  await app.startAllMicroservices();
}
bootstrap();
