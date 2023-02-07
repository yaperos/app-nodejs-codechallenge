import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUDSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud-kafka',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'kafka-transactions-22',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
