import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from 'libs/LoggingInterceptor';
import { HttpExceptionFilter } from 'libs/HttpExceptionFilter';
import { Config } from 'src/Config';
import helmet from 'helmet';
import compression from 'compression';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
//import { Client } from '@nestjs/microservices/external/nats-client.interface';


export const kafkaConfig: KafkaOptions = {
  transport:Transport.KAFKA,  
    options: {
      producer:{
        createPartitioner:Partitioners.LegacyPartitioner
      },
      client:
      {
          clientId: 'transaction',
          brokers: ['localhost:9092']
      },
      //producerOnlyMode:true,
      consumer: {
        groupId:'transaction-consumer'                    
      }
    }
};



function setupSwagger(app: INestApplication): void 
{
  const documentBuilder = new DocumentBuilder()
    .setTitle('Nest.js Transactions')
    .setDescription('This is a solution for YAPE')
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/v1', app, document, { swaggerOptions: { defaultModelsExpandDepth: -1 }});
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.connectMicroservice(kafkaConfig);
  //await app.startAllMicroservices();
  app.enableCors();
  app.use(helmet());
  //app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  //app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  setupSwagger(app);
  app.setGlobalPrefix('api/v1');
  await app.listen(Config.PORT);
}
bootstrap();
