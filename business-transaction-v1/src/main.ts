import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades que no están en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
    transform: true, // Transforma automáticamente los tipos (ej: string a number)
    transformOptions: {
      enableImplicitConversion: true, // Conversión implícita de tipos
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('Transaction API - DEV Environment')
    .setDescription('Transaction CRUD API with NestJS, PostgreSQL and OpenAPI')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
