import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionRepositoryContract } from './repositories/transactions/transaction.repository.contract';
import { TransactionTypeRepositoryContract } from './repositories/transaction-types/transaction-type.repository.contract';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { PaginationArgs } from './dto/pagination.args';
import { TransactionCreatedEvent } from './dto/transaction-created.event';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from '@app/common';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private readonly transactionRepository: TransactionRepositoryContract,
    @Inject('TRANSACTION_TYPE_REPOSITORY')
    private readonly transactionTypeRepository: TransactionTypeRepositoryContract,
    // @Inject('ANTIFRAUD_SERVICE')
    // private readonly antiFraudService: ClientKafka,
  ) {}

  async create(input: CreateTransactionInput) {
    const transactionType = await this.transactionTypeRepository.findById(
      +input.tranferTypeId,
    );

    if (!transactionType) {
      throw new Error("Transaction type doesn't");
    }

    const transaction = new Transaction();
    transaction.transactionType = transactionType;
    transaction.value = input.value;
    const trx = await this.transactionRepository.save(transaction);
    // this.antiFraudService.emit(
    //   'transaction_created',
    //   new TransactionCreatedEvent(
    //     trx.transactionExternalId,
    //     trx.value,
    //   ).toString(),
    // );
    return trx;
  }

  findAll(paginationArgs: PaginationArgs) {
    const { first, offset } = paginationArgs;
    return this.transactionRepository.findAll(first, offset);
  }

  findOne(id: string) {
    return this.transactionRepository.findById(id);
  }

  async updateStatus(updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findById(
      updateTransactionDto.transactionExternalId,
    );

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id: ${updateTransactionDto.transactionExternalId} not found`,
      );
    }

    transaction.status = updateTransactionDto.status;
    return this.transactionRepository.save(transaction);
  }
}
