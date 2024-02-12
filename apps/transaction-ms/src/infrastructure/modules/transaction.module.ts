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

const transactionProvider: Provider = {
  provide: Token.TRANSACTION,
  useFactory: (transactionRepo: TransactionRepository) => {
    return new TransactionService(transactionRepo);
  },
  inject: [TransactionMongoRepository],
};

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionDb.getClassName(), schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [transactionProvider, TransactionMongoRepository],
})
export class TransactionModule {}
