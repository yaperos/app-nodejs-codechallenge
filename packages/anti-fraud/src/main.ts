import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get("kafka.broker")],
        clientId: "anti-fraud-events-processor",
      },
      consumer: {
        groupId: "anti-fraud-consumer",
      },
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
