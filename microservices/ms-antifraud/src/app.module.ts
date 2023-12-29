import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID
              ? process.env.KAFKA_CLIENT_ID
              : 'antifraud-ms-client',
            brokers: [
              process.env.KAFKA_SERVER
                ? process.env.KAFKA_SERVER
                : 'localhost:9092',
            ],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_VALIDATIONS_ID
              ? process.env.KAFKA_GROUP_VALIDATIONS_ID
              : 'yape-kafka-validations-consumers',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
