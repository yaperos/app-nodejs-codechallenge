import { Module } from '@nestjs/common';
import { TransactionResolver } from './adapter/in/graphql/transaction.resolver';
import { CreateTransactionService } from './service/create-transaction.service';
import { TransactionPostgresRepository } from './adapter/out/db/postgres/transaction-postgres.repository';
import { TransactionDbEntity } from './adapter/out/db/postgres/transaction-db.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { TransactionKafkaProducer } from './adapter/out/messaging/kafka/transaction-kafka.producer';
import { GetTransactionsService } from './service/get-transactions.service';
import { UpdateTransactionsService } from './service/update-transactions.service';
import { TransactionUpdateStatusKafkaConsumer } from './adapter/in/messaging/kafka/transaction-update-status-kafka.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionDbEntity])],
  providers: [
    TransactionResolver,
    CreateTransactionService,
    {
      provide: 'TransactionRepository',
      useClass: TransactionPostgresRepository,
    },
    TransactionKafkaProducer,
    GetTransactionsService,
    UpdateTransactionsService,
    TransactionUpdateStatusKafkaConsumer,
  ],
  controllers: [],
})
export class TransactionModule {}
