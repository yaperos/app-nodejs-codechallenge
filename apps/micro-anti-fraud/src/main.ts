import { ConfigService } from "@nestjs/config";
import { NestFactory } from '@nestjs/core';
import { MicroAntiFraudModule } from './anti-fraud.module';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(MicroAntiFraudModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
        options: {
            subscribe: {
                fromBeginning: true,
            },
            client: {
                clientId: 'micro-anti-fraud',
                brokers: [`localhost:29092`],
            },
            consumer: {
                groupId: 'anti-fraud-consumer',
            },
        },
  } as MicroserviceOptions)

  app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
