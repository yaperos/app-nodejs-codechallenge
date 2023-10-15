import { Module } from '@nestjs/common';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: process.env.KAFKA_SERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_TRANSACTIONS_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: process.env.KAFKA_TRANSACTIONS_CONSUMER_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
