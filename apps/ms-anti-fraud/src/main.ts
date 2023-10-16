import { NestFactory } from '@nestjs/core';
import { MsAntiFraudModule } from './ms-anti-fraud.module';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MsAntiFraudModule);
  const configService: ConfigService = app.get(ConfigService);
  const port = +configService.get('configuration').port;
  console.log(port);
  app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
