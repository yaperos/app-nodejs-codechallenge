import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: configService.get('KAFKA_GROUP_ID')
      },
      client: {
        brokers: [configService.get('KAFKA_BROKER')],
      }
    }
  } as MicroserviceOptions);

  app.startAllMicroservices();

  await app.listen(Number(configService.get('APP_PORT')));
}
bootstrap();
