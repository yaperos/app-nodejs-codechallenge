import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { FindTransaction } from '../FindTransaction';
import { FindTransactionOutput } from './output/FindTransactionOutput';
import { STATUS, TYPE } from 'src/modules/transaction/domain/Transaction';
import { getEnumKey } from 'src/Shared/infrastructure/utils';

@Resolver()
export class FindTransactionResolver {
  constructor(private readonly findTransaction: FindTransaction) {}

  @Query(() => FindTransactionOutput)
  async getTransactionById(
    @Args('transactionId', { type: () => Int }) transactionId: number,
  ): Promise<FindTransactionOutput> {
    const response = await this.findTransaction.run({ transactionId });
    return {
      transactionExternalId: response.getId(),
      transactionType: { name: getEnumKey(TYPE, response.getType()) },
      transactionStatus: { name: getEnumKey(STATUS, response.getStatus()) },
      value: response.getValue(),
      createdAt: response.getCreatedAt(),
      updatedAt: response.getUpdatedAt(),
    };
  }
}
