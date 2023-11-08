import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
const logger = new Logger(`Service BFF`);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ? +process.env.PORT : 3000);
  logger.log(`BFF is listening on: ${await app.getUrl()}`);
}
bootstrap();
