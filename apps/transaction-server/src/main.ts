import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: process.env.KAFKA_BROKERS.split(',')
      },
      consumer: {
        groupId: 'anti-fraud-consumer-2',
      },
    },
  });

  app.enableCors({ origin: process.env.ALLOWED_ORIGIN });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Yape Transaction API')
    .setDescription('Yape Transaction API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
