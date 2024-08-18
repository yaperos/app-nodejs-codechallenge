import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'ms-transaction-consumer',
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner,
        },
      },
    });

  await microserviceApp.listen();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Financial Yape Transaction')
    .setDescription('Microservicions Of Transaction And Fraude')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users', 'Operations Related To Users')
    .addTag('transactions', 'Operations Related To Transactions')
    .setContact(
      'Rafael Guevara Aller',        
      'https://www.linkedin.com/in/rafael-guevara/', 
      'djzm80@gmail.com'            
    );
  const documentBuild = config.build();
  const document = SwaggerModule.createDocument(app, documentBuild);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      filter: true, 
    },
  });

  await app.listen(port);
}
bootstrap();
