import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Transaction Microservices')
    .setDescription('Microservicios de transacciones')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
