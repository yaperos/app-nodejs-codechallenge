import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api/v1');

  app.enableCors();
  
  const port = 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📊 Health check: http://localhost:${port}/api/v1/transactions/health/check`);
}

bootstrap();