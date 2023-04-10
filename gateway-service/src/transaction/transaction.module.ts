import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: 'transaction-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class TransactionModule {
}
