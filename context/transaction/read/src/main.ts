import { Logger, ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { ReadTransactionModule } from "./read.module";

async function bootstrap() {
  const app = await NestFactory.create(ReadTransactionModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: process.env.READ_TRANSACTION_GROUP_ID,
      },
    },
  } as MicroserviceOptions);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.READ_PORT || 3001;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`App is running on: http://localhost:${port}/graphql`);
}
bootstrap();
