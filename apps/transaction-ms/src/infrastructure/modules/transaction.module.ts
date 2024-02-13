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

const transactionProvider: Provider = {
  provide: Token.TRANSACTION,
  useFactory: (
    transactionRepo: TransactionRepository,
    transactionTypeService: TransactionTypeService,
  ) => {
    return new TransactionService(transactionRepo, transactionTypeService);
  },
  inject: [TransactionMongoRepository, Token.TRANSACTION_TYPE],
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
