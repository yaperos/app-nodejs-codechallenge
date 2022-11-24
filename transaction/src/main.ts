import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport : Transport.KAFKA,
    options: {
      consumer: {
        groupId: 'anti-fraud-consumer',
      },
      client: {
        brokers: ['localhost:9092'],
      },
    },
  } as MicroserviceOptions);
  await  app.startAllMicroservices()
  const config = new DocumentBuilder()
    .setTitle('Transaction Challenger')
    .setDescription('Api para crear transacciones')
    .setVersion('1.0')
    .addTag('transaction')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3003);
}
bootstrap();
