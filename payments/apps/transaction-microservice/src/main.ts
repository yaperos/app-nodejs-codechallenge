import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { AllExceptionFilter } from './app/infrastructure/common/filter/exception.filter';
import { LoggerService } from './app/infrastructure/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 5555
    }
  });

  //Filters
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  //Pipes
  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
}

bootstrap();
