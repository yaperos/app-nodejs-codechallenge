import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { envConfig } from "@shared/config";
import { CommandsModule } from "apps/transactions-command/src/commands.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CommandsModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: envConfig.kafka.txCommandClientId,
        brokers: envConfig.kafka.brokers,
      },
      consumer: { groupId: envConfig.kafka.txCommandConsumerGroupId },
      run: { autoCommit: true },
    },
  });

  await app.listen();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();