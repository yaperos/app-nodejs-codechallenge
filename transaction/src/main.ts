import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Crea una instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // Conecta el microservicio Kafka a la aplicación
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: 'transaction-consumer',
      },
      client: {
        brokers: ['localhost:9092'],
      },
    },
  });

  // Configura la documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('Financial transaction')
    .setDescription('API for financial transactions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Inicia los microservicios y el servidor HTTP
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}

bootstrap();