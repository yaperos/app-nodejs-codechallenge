import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.startAllMicroservices()
  await app.listen(3000);
}

bootstrap();