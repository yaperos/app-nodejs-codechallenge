import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './transaction-repository';
import { Transaction } from './entities/transaction.entity';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async getTransactionType(transactionTypeId: number) {
    const transactionType =
      await this.transactionRepository.getTransactionType(transactionTypeId);
    if (!transactionType) {
      throw new NotFoundException(
        `Transaction type with id ${transactionTypeId} not found`,
      );
    }
    return transactionType;
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    const transactionType = await this.getTransactionType(
      createTransactionDto.transferTypeId,
    );

    const transaction = new Transaction();
    transaction.accountExternalIdCredit =
      createTransactionDto.accountExternalIdCredit;
    transaction.accountExternalIdDebit =
      createTransactionDto.accountExternalIdDebit;
    transaction.value = createTransactionDto.value;
    transaction.transactionType = transactionType;

    const newTransaction = await this.transactionRepository.create(transaction);

    this.kafkaClient.emit('transaction_created', {
      transactionExternalId: newTransaction.transactionExternalId,
      amount: newTransaction.value,
    });

    return {
      transactionExternalId: newTransaction.transactionExternalId,
      transactionType: {
        name: transactionType.transactionTypeName,
      },
      transactionStatus: {
        name: newTransaction.transactionStatus,
      },
      value: newTransaction.value,
      createdAt: newTransaction.createdAt,
    };
  }

  async findOne(id: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transactionType.transactionTypeName,
      },
      transactionStatus: {
        name: transaction.transactionStatus,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  async updateStatus(
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne(
      updateTransactionDto.transactionExternalId,
    );
    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${updateTransactionDto.transactionExternalId} not found`,
      );
    }
    await this.transactionRepository.updateStatus(
      updateTransactionDto.transactionExternalId,
      updateTransactionDto.transactionStatus,
    );

    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transactionType.transactionTypeName,
      },
      transactionStatus: {
        name: updateTransactionDto.transactionStatus,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
