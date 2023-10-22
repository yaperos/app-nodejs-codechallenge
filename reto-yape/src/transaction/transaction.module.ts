import { Module } from '@nestjs/common';
import { TransactionService } from './service/transaction.service';
import { TransactionResolver } from './resolver/transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entity/transaction.entity';
import { ConsumerController } from './consumer/consumer.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionStatusEntity } from './entity/transaction-status.entity';
import { TransactionTypeEntity } from './entity/transaction-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      TransactionStatusEntity,
      TransactionTypeEntity
    ]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['kafka-yape:29092']
          }
        }
      }
    ])
  ],
  providers: [TransactionService, TransactionResolver],
  controllers: [ConsumerController]
})
export class TransactionModule { }
