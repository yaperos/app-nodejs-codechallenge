import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { grpcClientOptions } from "./grpc.config";
import { kafkaConfig } from "./kafka.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);
  app.connectMicroservice<MicroserviceOptions>(kafkaConfig);

  await app.listen(3001);
  await app.startAllMicroservices();
}
bootstrap();
