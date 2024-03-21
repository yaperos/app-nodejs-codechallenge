import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './domain/entities/transaction';
import { TransactionSecondaryAdapter } from './infrastructure/adapters/implements/TransactionSecondaryAdapter';
import { TransactionController } from './infrastructure/controllers/TransactionPrimaryAdapter';
import { TransactionConsumerService } from './infrastructure/adapters/consumers/kafka';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionSecondaryAdapter, TransactionConsumerService],
})
export class TransactionModule {}
