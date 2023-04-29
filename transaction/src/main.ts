import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transactions',
        brokers: ['localhost:9092'],
        },
      consumer: {
        groupId: 'transaction-consumer'
        }
      }
  } as MicroserviceOptions);

  const config = new DocumentBuilder()
    .setTitle('Transactions Microservice')
    .setDescription('Transactions Microservice Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('explorer', app, document);
  

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
