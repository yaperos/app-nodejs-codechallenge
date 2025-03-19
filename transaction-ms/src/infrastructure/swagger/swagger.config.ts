import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createSwaggerDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Transaction Service')
    .setDescription('API para creación y consulta de transacciones')
    .setVersion('1.0')
    .build();

  return SwaggerModule.createDocument(app, config);
}
