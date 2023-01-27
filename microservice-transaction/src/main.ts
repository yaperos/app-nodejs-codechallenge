import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction',
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'transaction-consumer',
      },
    }
  })

  const config = new DocumentBuilder()
    .setTitle('Transaction Microservice')
    .setDescription('Transactions')
    .setVersion('1.0')
    .addTag('transaction')

  const document = SwaggerModule.createDocument(app, config.build()); 
  
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.startAllMicroservices();
  await app.listen(process.env.PORT);
  Logger.log(`Microservice Transaction is running on port ${process.env.PORT}`);
}
bootstrap();
