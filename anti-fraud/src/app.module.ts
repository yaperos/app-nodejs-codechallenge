import { Module } from '@nestjs/common';
import { AntiFraudController } from './controllers/anti-fraud.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionService } from './services/transaction.service';
import { TransactionEvent } from './events/transaction.event';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [TransactionService, TransactionEvent],
})
export class AppModule {}
