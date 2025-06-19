import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './infrastructure/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // API prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Setup Swagger documentation
  setupSwagger(app);

  // Get port from environment
  const port = process.env.PORT || 3000;

  await app.listen(port);
  
  console.log(`Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`Documentación de API: http://localhost:${port}/api/docs`);
  console.log(`Health Check: http://localhost:${port}/${apiPrefix}/health`);
}

bootstrap(); 