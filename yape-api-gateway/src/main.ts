import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import * as cookieParser from 'cookie-parser';
// import { NotFoundExceptionFilter } from './Shared/domain/NotFoundExceptionFilter';
import { ValidationPipe } from '@nestjs/common';
// import { BadRequestException, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    // all headers that client are allowed to use
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     exceptionFactory: (errors) => {
  //       const formattedErrors = errors.reduce((accumulator, error) => {
  //         accumulator[error.property] = Object.values(error.constraints).join(
  //           ', ',
  //         );
  //         return accumulator;
  //       }, {});

  //       throw new BadRequestException(formattedErrors);
  //     },
  //   }),
  // );
  // app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(3000);
}
bootstrap();
