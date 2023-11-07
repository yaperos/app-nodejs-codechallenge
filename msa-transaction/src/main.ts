import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './middleware/all-exceptions.filter';
const logger = new Logger(`Service Transaction`);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ? +process.env.PORT : 3000);
  logger.log(`Microservice is listening on: ${await app.getUrl()}`);
}
bootstrap();
