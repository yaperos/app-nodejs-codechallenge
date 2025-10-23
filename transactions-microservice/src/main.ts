import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { StreamingConfigurations } from 'src/utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: StreamingConfigurations.CLIENT_ID,
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: StreamingConfigurations.GROUP_ID,
      },
    },
  });

  await app.startAllMicroservices();
  const port = configService.get<string>('server.port');
  await app.listen(port);
}
void bootstrap();
