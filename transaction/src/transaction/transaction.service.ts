import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './models/create-transaction.dto';
import { Transaction, TransactionStatus } from './models/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './models/transaction-created.event';
@Injectable()
export class TransactionService {
  constructor(
    @Inject('KAFKA') private readonly eventBus: ClientKafka,
    @InjectRepository(Transaction)
    readonly transactionRepository: Repository<Transaction>
  ) { }

  async create(dto: CreateTransactionDto): Promise<void> {
   const transaction = new Transaction();
    transaction.accountExternalIdDebit = dto.accountExternalIdDebit;
    transaction.accountExternalIdCredit = dto.accountExternalIdCredit;
    transaction.tranferTypeId = dto.tranferTypeId;
    transaction.createdAt = new Date();
    transaction.status = TransactionStatus.PENDING;
    transaction.value = dto.value;
    const savedTransaction = await this.transactionRepository.save(transaction);
    await this.eventBus.emit(TransactionCreatedEvent.getName(), TransactionCreatedEvent.toEvent(savedTransaction));
  }

  async approveTransaction(id: string): Promise<void> {
    await this.transactionRepository.update(
      { id },
      { status: TransactionStatus.APPROVED },
    );
  }

  async rejectTransaction(id: string): Promise<void> {
    await this.transactionRepository.update(
      { id },
      { status: TransactionStatus.REJECTED },
    );
  }

   async find(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }
}