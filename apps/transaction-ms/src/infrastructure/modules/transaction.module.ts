import { Module, Provider } from '@nestjs/common';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from '../../domain/services/transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token } from '../constants';
import {
  TransactionDb,
  TransactionMongoRepository,
  TransactionSchema,
} from '../repositories/transaction-mongo.repository';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionTypeService } from '../../domain/services/transaction-type.service';
import { TransactionTypeMemoryRepository } from '../repositories/transaction-type-memory.repository';
import { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaModule } from '@app/common';

const transactionProvider: Provider = {
  provide: Token.TRANSACTION,
  useFactory: (
    transactionRepo: TransactionRepository,
    transactionTypeService: TransactionTypeService,
    transactionSender: ClientKafka,
  ) => {
    return new TransactionService(
      transactionRepo,
      transactionTypeService,
      transactionSender,
    );
  },
  inject: [
    TransactionMongoRepository,
    Token.TRANSACTION_TYPE,
    Token.TRANSACTION_CLIENT,
  ],
};

const transactionTypeProvider: Provider = {
  provide: Token.TRANSACTION_TYPE,
  useFactory: (transactionTypeRepo: TransactionTypeRepository) => {
    return new TransactionTypeService(transactionTypeRepo);
  },
  inject: [TransactionTypeMemoryRepository],
};

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionDb.getClassName(), schema: TransactionSchema },
    ]),
    KafkaModule,
    KafkaModule.register(Token.TRANSACTION_CLIENT),
  ],
  controllers: [TransactionController],
  providers: [
    transactionProvider,
    TransactionMongoRepository,
    transactionTypeProvider,
    TransactionTypeMemoryRepository,
  ],
})
export class TransactionModule {}
