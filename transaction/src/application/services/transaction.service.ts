import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionAdapter } from 'src/infrastructure/adapters/transaction.adapter';
import { TransactionUtils } from 'src/shared/transaction-utils';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { CreateTransactionResponseDto } from '../dtos/create-transaction-response.dto';
import { Transaction } from 'src/domain/transaction';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';

@Injectable()
export class TransactionService{

  constructor(
    @Inject(TransactionAdapter)
    private readonly transactionRepository: TransactionRepository,
    @Inject('TRANSACTION_EVENTS') private readonly kafkaClient: ClientKafka,
  ) {}

    async createTransaction(createTransactionDto: CreateTransactionDto): Promise<CreateTransactionResponseDto> {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    } = createTransactionDto;

    const transaction = new Transaction({
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    });

    const transactionCreated = await this.transactionRepository.save(transaction);
    console.log("emit: ",transactionCreated);
    this.kafkaClient.emit('transaction-created',
      JSON.stringify({
        transactionExternalId: transactionCreated.getAllProperties().transactionExternalId,
        value: transactionCreated.getAllProperties().value,
      }),
    );

    return TransactionUtils.fromTransactionToCreateTransactionResponse(transactionCreated);
  }

  async getTransactionById(transactionExternalId: string) {
    const transaction = await this.transactionRepository.getById(transactionExternalId);
    return TransactionUtils.fromTransactionToReponse(transaction);
  }

  async updateTransaction(transactionExternalId: string, status: number) {
    await this.transactionRepository.update(transactionExternalId, {status});
    return Promise.resolve();
  }

}

