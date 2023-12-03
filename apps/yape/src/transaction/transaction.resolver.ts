
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { TransactionType } from './transaction.model';
import { TransactionService } from './transaction.service';

@Resolver()
export class TransactionResolver {
  constructor(private readonly service: TransactionService) { }

  @Query(() => TransactionType)
  getTransaction(@Args('transactionExternalId') transactionExternalId: string) {
    return this.service.get(transactionExternalId);
  }

  @Mutation((returns) => TransactionType)
  async newTransaction(
    @Args('accountExternalIdDebit') accountExternalIdDebit: string,
    @Args('accountExternalIdCredit') accountExternalIdCredit: string,
    @Args('transferTypeId') transferTypeId: number,
    @Args('value') value: number,
  ) {
    const tr = await this.service.save({
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    });

    this.service.validate(tr.id, value);

    return {
      value,
      transactionExternalId: tr.id,
      transactionType: { name: transferTypeId.toString() },
      transactionStatus: { name: tr.status },
      createdAt: tr.createdAt,
    };
  }
}
