import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDTO } from './structure/dto/CreateTransactionDTO';
import { TransactionStatus } from './structure/enums/transaction.status';
import { EventPatternEvents } from 'src/constants/event-pattern-events';
import { TransactionStatus as TransactionStatusS } from 'src/constants/transaction-status';
import { UpdateTransactionDTO } from './structure/dto/UpdateTransactionDTO';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ANTI_FRAUD_MS') private readonly clientKafka: ClientKafka,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(data: CreateTransactionDTO) {
    const transaction = new Transaction();
    transaction.accountExternalIdCredit = data.accountExternalIdCredit;
    transaction.accountExternalIdDebit = data.accountExternalIdDebit;
    transaction.transferTypeId = data.transferTypeId;
    transaction.value = data.value;
    transaction.createdAt = new Date();
    transaction.transactionStatus = TransactionStatus.PENDING;

    const { id } = await this.transactionRepository.save(transaction);
    transaction.id = id;

    this.clientKafka.emit(
      EventPatternEvents.ValidationTransaction,
      JSON.stringify({ id, value: transaction.value }),
    );

    return transaction;
  }

  findOneById(id: number) {
    return this.transactionRepository.findOneBy({ id });
  }

  findAll() {
    return this.transactionRepository.find();
  }

  async getTransactionUpdated(data: UpdateTransactionDTO) {
    const transaction = await this.findOneById(data.id);

    if (data.status === TransactionStatusS.APPROVED) {
      transaction.transactionStatus = TransactionStatus.APPROVED;
    } else {
      transaction.transactionStatus = TransactionStatus.REJECTED;
    }

    return this.transactionRepository.save(transaction);
  }
}
