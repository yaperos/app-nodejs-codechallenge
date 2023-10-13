import 'config/env.config';
import { NestFactory } from '@nestjs/core';
import { GqlGatewayModule } from './gql-gateway.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GqlGatewayModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  // connect Kafka
  await app.startAllMicroservices();
  await app.listen(process.env.GQL_GATEWAY_PORT);
}
bootstrap();
