import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Docs
  const config = new DocumentBuilder()
    .setTitle('API REST - CODE CHALLENGE')
    .setDescription('Documentación de apis')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs-api', app, document);

  // Puerto
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
