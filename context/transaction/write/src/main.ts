import { Logger, ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { WriteTransactionModule } from "./write.module";

async function bootstrap() {
  const app = await NestFactory.create(WriteTransactionModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: process.env.WRITE_TRANSACTION_GROUP_ID,
      },
    },
  } as MicroserviceOptions);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.WRITE_PORT || 3000;
  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`App is running on: http://localhost:${port}/graphql`);
}
bootstrap();
