import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { TransactionModule } from './transaction.module';
config();

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/graphql`);
}
bootstrap();
