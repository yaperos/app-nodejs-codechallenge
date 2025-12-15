import { Resolver, Query, Args } from '@nestjs/graphql';
import { AppService } from './app.service';
import { TransactionType } from './dto/transaction.type';

@Resolver(() => TransactionType)
export class AppResolver {
  constructor(private readonly transactionsService: AppService) {}

  @Query(() => TransactionType, { name: 'getTransaction' })
  async getTransaction(@Args('id') id: string) {
    return this.transactionsService.findTransaction(id);
  }
}