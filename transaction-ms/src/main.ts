import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument } from './infrastructure/swagger/swagger.config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);


  const swaggerDocument = createSwaggerDocument(app);
  SwaggerModule.setup('api', app, swaggerDocument);


  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'transaction-service-group',
      },
    },
  });


  await app.listen(3001);
  console.log('HTTP server escuchando en http://localhost:3000');


  await app.startAllMicroservices();
  console.log('Microservicio Kafka iniciado');
}

bootstrap();
