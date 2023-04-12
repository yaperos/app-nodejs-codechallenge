import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-gateway',
            brokers: ['localhost:9092'],
          },
          // producerOnlyMode: true,
          consumer: {
            groupId: 'transaction-service-sender',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [],
})
export class TransactionModule {}
