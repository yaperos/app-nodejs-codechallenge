import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './infrastructure/entities/transaction.entity';
import { TransactionController } from './infrastructure/controllers/transaction-controller';
import { CreateTransaction } from './application/create-transaction';
import { AfterUserCreated } from './domain/subscribers/after-user-created';
import { transactionRepository } from './infrastructure/custom-providers.ts/custom-providers';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FindTransaction } from './application/find-transaction';
import { UpdateTransaction } from './application/update-transaction';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientsModule.register([
      {
        name: 'YAPE',
        transport: Transport.KAFKA,
        options: {
          consumer: {
            groupId: 'kafka-consumer',
          },
          client: {
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransaction,
    FindTransaction,
    UpdateTransaction,
    AfterUserCreated,
    transactionRepository,
  ],
})
export class TransactionModule {}
