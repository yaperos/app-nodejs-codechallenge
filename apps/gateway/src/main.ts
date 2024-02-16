import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GatewayModule } from './gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('PORT'));
  Logger.log(
    `GraphQL gateway running on ${configService.get<string>('GATEWAY_URL')}/graphql`,
  );
}
bootstrap();
