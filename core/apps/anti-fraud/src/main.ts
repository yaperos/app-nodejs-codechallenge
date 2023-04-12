import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { KafkaEnum } from 'apps/shared/enum/kafka-config.enum';
import { AntiFraudModule } from './anti-fraud.module';

async function bootstrap() {

  const appMicroservice = await NestFactory.createMicroservice(AntiFraudModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KafkaEnum.ClientID,
        brokers: [KafkaEnum.Broker1],
      },
      consumer: {
        groupId: KafkaEnum.GroupId
      }
    }
  });
  await appMicroservice.listen();

  const app = await NestFactory.create(AntiFraudModule);
  await app.listen(3001);
}
bootstrap();
