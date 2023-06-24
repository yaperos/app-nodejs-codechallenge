import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './event/transaction-created-event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionStatus } from './enum/transaction-status';
import { UpdateTransactionStatusEvent } from './event/update-transaction-status-event';
import { TransactionMapper } from './mapper/transaction.mapper';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('ANTI_FRAUD_MICROSERVICE')
    private readonly antiFraudClient: ClientKafka,
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async createTransaction(
    request: CreateTransactionRequestDto,
  ): Promise<TransactionDto> {
    const savedTransaction = await this.saveTransaction(request);
    this.emitCreateTransactionEvent(savedTransaction);
    return TransactionMapper.entityToDto(savedTransaction);
  }

  async retrieveAllTransactions(): Promise<TransactionDto[]> {
    const transactions = await this.repository.find();
    return TransactionMapper.entityListToDtoList(transactions);
  }

  async retrieveTransaction(id: string): Promise<TransactionDto> {
    const transaction = await this.repository.findOneBy({
      transactionExternalId: id,
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return TransactionMapper.entityToDto(transaction);
  }

  async updateTransactionStatus(
    request: UpdateTransactionStatusEvent,
  ): Promise<TransactionDto> {
    const transaction = await this.repository.findOneBy({
      transactionExternalId: request.transactionExternalId,
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    transaction.status = request.status;
    const updatedTransaction = await this.repository.save(transaction);
    return TransactionMapper.entityToDto(updatedTransaction);
  }

  private saveTransaction(
    request: CreateTransactionRequestDto,
  ): Promise<Transaction> {
    const transaction = this.repository.create({
      transferTypeId: request.transferTypeId,
      value: request.value,
      accountExternalIdDebit: request.accountExternalIdDebit,
      accountExternalIdCredit: request.accountExternalIdCredit,
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
    });
    return this.repository.save(transaction);
  }

  private emitCreateTransactionEvent({
    transactionExternalId,
    value,
  }: Transaction): void {
    this.antiFraudClient.emit(
      'transaction_created',
      new TransactionCreatedEvent(transactionExternalId, value),
    );
  }
}
