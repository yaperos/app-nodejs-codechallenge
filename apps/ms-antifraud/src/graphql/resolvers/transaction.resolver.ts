import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionDto } from '../../common/dto/transaction.dto';
import { TransactionService } from '../../transactions/services/transaction.service';
import { CreateTransactionInput } from '../../common/dto/transaction.input';
import { KafkaProducerService } from '../../kafka/services/kafka-producer.service';

@Resolver(() => TransactionDto)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly KafkaProducerService: KafkaProducerService,
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

    await this.KafkaProducerService.sendTransactionToTopic(transaction);

    return transaction;
  }

  async storeTransaction( transactionData: any): Promise<void> {
    await this.transactionService.storeTransaction(transactionData);
  }
}
