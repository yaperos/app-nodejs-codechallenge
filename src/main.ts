import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientsModule, MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices'
import { GqlModuleAsyncOptions, GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/dist/esm/plugin/landingPage/default';
import { KafkaModule } from 'nestjs-kafka';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['pkc-ymrq7.us-east-2.aws.confluent.cloud:9092'],
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: 'JOEYP22BDKQ4GLKI',
          password: 'VNZMmXdNQaAVs0tvFpkJy2KW4fourFbpT5KH60JSK1Y0A6pfY60nIsK/Ec0/GbWx'
        }
        
      },
      consumer: {
        groupId: 'kafka-consumer',
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  } as MicroserviceOptions);
  
  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true, 
    })
  );

  await app.listen(3000);
}

bootstrap();