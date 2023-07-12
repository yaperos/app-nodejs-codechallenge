import { NestFactory } from '@nestjs/core';
import {UnprocessableEntityException, ValidationError, ValidationPipe} from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new UnprocessableEntityException(validationErrors.map(error => {
        return {
          property: error.property,
          errors: Object.values(error.constraints),
        };
      }));
    },
  }));
  await app.listen(3000);
}
bootstrap();
