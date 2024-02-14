import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionDto } from '../../common/dto/transaction.dto';
import { TransactionService } from '../../transactions/services/transaction.service';
import { CreateTransactionInput } from '../../common/dto/transaction.input';
import { KafkaProducerService } from '../../kafka/services/kafka-producer.service';
import { Logger } from '@nestjs/common';

@Resolver(() => TransactionDto)
export class TransactionResolver {
  private readonly logger = new Logger(TransactionResolver.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  @Query(() => [TransactionDto])
  async getAllTransactions(): Promise<TransactionDto[]> {
    try {
      return await this.transactionService.getAllTransactions();
    } catch (error) {
      this.logger.error(`Error in getAllTransactions: ${error.message}`);
      throw error;
    }
  }

  @Mutation(() => TransactionDto)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<TransactionDto> {
    try {
      const newTransaction = {
        accountExternalIdDebit: input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        transferTypeId: input.transferTypeId,
        value: input.value,
      };

      const transaction = await this.transactionService.storeTransaction(newTransaction);

      await this.kafkaProducerService.sendTransactionToTopic(transaction);

      return transaction;
    } catch (error) {
      this.logger.error(`Error in createTransaction: ${error.message}`);
      throw error;
    }
  }

  async storeTransaction(transactionData: any): Promise<void> {
    try {
      await this.transactionService.storeTransaction(transactionData);
    } catch (error) {
      this.logger.error(`Error in storeTransaction: ${error.message}`);
      throw error;
    }
  }
}
