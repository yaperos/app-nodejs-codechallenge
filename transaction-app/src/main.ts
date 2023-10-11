import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create a regular Nest application

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    },
  });
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Transactions')
    .setDescription('Transaction swagger documentation')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3001); // Adjust the port as needed
}
bootstrap();