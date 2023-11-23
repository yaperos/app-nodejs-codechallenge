import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, ClientKafka, Transport } from '@nestjs/microservices';
import { ProducerService } from './producer/producer.service';
import { TransactionsService } from './transactions/transactions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          subscribe: {
            fromBeginning: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [ProducerService, TransactionsService, ClientKafka],
})
export class AppModule {}
