import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get("kafka.broker")],
        clientId: "transaction-events-processor",
      },
      consumer: {
        groupId: "transaction-consumer",
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<number>("port"));
}
bootstrap();
