// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { StreamingConfigurations } from 'src/utils/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: StreamingConfigurations.CLIENT_ID,
          brokers: [process.env.BROKER_URL],
        },
        consumer: { groupId: StreamingConfigurations.GROUP_ID },
      },
    },
  );

  await app.listen();
}
void bootstrap();
