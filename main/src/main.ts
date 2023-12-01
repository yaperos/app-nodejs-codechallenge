import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/appModule';
import { ValidationPipe } from './api/validationPipe';
import { config }  from './config'
import { Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  console.log(config)
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        //clientId: config.kafka.clientId,
        brokers: [config.kafka.uri],
      },
      //producer: { createPartitioner: Partitioners.LegacyPartitioner },
      //consumer: { groupId: config.kafka.groupId },
    },
  });

  await app.startAllMicroservices();

  const port = config.app.port
  const host = config.app.host

  await app.listen(port, host)
}
bootstrap();