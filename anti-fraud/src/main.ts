import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options:{
      consumer: {
        groupId: 'transactions-consumer'
      },
      client:{
        brokers:['localhost:9092'] 
      },
      subscribe:{
        fromBeginning: true
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    }
  } as MicroserviceOptions)

  const config = new DocumentBuilder()
    .setTitle('Microservicio de Anti-fraude')
    .setDescription(
      'Api que expone las funcionalidades correspondientes al microservicio de anti-fraude',
    )
    .setVersion('1.0')
    .addTag('Anti-fraude')
    .addBearerAuth()
    .addServer('api')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));

  
  SwaggerModule.setup('', app, document);

  app.enableCors({
    allowedHeaders: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: ['http://localhost:4000/'],
  });
  app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
