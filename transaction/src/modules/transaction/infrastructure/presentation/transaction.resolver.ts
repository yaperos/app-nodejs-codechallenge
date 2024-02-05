import { Args, Query, Resolver } from '@nestjs/graphql';

import { TransactionApplication } from '../../application/transaction.application';
import { TransactionDoc } from '../entities/transaction-doc.entity';
import { TransactionGetOneDto } from './dtos/transaction-getone.dto';

@Resolver()
export class TransactionResolver {
  constructor(private readonly application: TransactionApplication) {}

  @Query((returns) => TransactionDoc)
  async getTransaction(
    @Args('input') body: TransactionGetOneDto,
  ): Promise<TransactionDoc> {
    return await this.application.getByIdDoc(body.transactionId);
  }
}
