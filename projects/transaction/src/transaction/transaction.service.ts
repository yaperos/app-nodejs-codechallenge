import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDTO } from './models/create-transaction.dto';
import { Transaction } from './models/transaction.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TransactionStatus } from './models/transaction.model';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './models/transaction-created.event';

@Injectable()
export class TransationService {
  constructor(
    @Inject('KAFKA')
    private readonly eventBus: ClientKafka,
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async create(data: CreateTransactionDTO): Promise<void> {
    const transaction = new Transaction();
    transaction.id = uuidv4();
    transaction.createdAt = new Date();
    transaction.status = TransactionStatus.PENDING;
    transaction.type = data.tranferTypeId;
    transaction.value = data.value;
    await this.repository.save(transaction);
    this.eventBus.emit(
      TransactionCreatedEvent.getName(),
      TransactionCreatedEvent.toEvent(transaction),
    );
  }

  async approveTransaction(id: string): Promise<void> {
    await this.repository.update(
      { id },
      { status: TransactionStatus.APPROVED },
    );
  }

  async rejectTransaction(id: string): Promise<void> {
    await this.repository.update(
      { id },
      { status: TransactionStatus.REJECTED },
    );
  }

  async find(): Promise<Transaction[]> {
    return this.repository.find();
  }
}
