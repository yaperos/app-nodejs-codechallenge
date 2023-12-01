import { CreateTransaction } from '../CreateTransaction';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateTransactionInput } from './input/CreateTransactionInput';
import { Transaction } from 'src/modules/transaction/infrastructure/persistence/TransactionPrismaModel';

@Resolver()
export class CreateTransactionResolver {
  constructor(private readonly useCase: CreateTransaction) {}
  @Mutation(() => Transaction)
  async createTransaction(@Args('input') input: CreateTransactionInput) {
    return await this.useCase.run({
      value: input.value,
      transferTypeId: input.transferTypeId,
    });
  }
}
