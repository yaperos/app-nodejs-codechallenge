import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { Transaction } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name: 'ANTI-FRAUD-MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    makeCounterProvider({
      name: 'transactions_saved',
      help: 'Saved transactions counter',
    }),
    makeCounterProvider({
      name: 'transactions_updated',
      help: 'Updated transactions counter',
    }),
  ],
})
export class TransactionModule {}
