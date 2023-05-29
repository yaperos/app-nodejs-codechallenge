import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Transaction service - API Documentation')
  .setDescription('Transaction service')
  .setVersion('1.0')
  .build();
