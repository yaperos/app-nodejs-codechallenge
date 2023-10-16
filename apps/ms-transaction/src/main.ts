import { NestFactory } from '@nestjs/core';
import { MsTransactionModule } from './ms-transaction.module';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MsTransactionModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = +configService.get('configuration').port;
  app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
