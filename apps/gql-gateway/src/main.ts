import 'config/env/env.config';
import { NestFactory } from '@nestjs/core';
import { GqlGatewayModule } from './gql-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'modules/logger/logger.service';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';

const logger = new Logger('GQL Gateway');

async function bootstrap() {
  const app = await NestFactory.create(GqlGatewayModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.useLogger(app.get(Logger));
  await app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  await app.startAllMicroservices();
  await app.listen(process.env.GQL_GATEWAY_PORT);
  logger.log(`Microservice is listening on: ${await app.getUrl()}`);
}
bootstrap();
