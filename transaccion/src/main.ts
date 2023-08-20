import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './utils/validation.pipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configura la documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('Financial transaction Yape')
    .setDescription('API for financial transactions Yape')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
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

  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
