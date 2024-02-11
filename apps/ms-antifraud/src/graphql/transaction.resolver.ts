import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './transaction.input';
import { KafkaService } from './kafka.service';

@Resolver(() => TransactionDto)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Query(() => [TransactionDto])
  async getAllTransactions(): Promise<TransactionDto[]> {
    return this.transactionService.getAllTransactions();
  }

  @Mutation(() => TransactionDto)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<TransactionDto> {
    const newTransaction = {
      accountExternalIdDebit: input.accountExternalIdDebit,
      accountExternalIdCredit: input.accountExternalIdCredit,
      transferTypeId: input.transferTypeId,
      value: input.value,
    };

    const transaction = await this.transactionService.storeTransaction(newTransaction);

    await this.kafkaService.sendTransactionToTopic(transaction);

    return transaction;
  }

  async storeTransaction( transactionData: any): Promise<void> {
    await this.transactionService.storeTransaction(transactionData);
  }
}
