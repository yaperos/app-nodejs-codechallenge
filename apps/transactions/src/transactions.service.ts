import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { CreateTransactionDTO } from './dtos/create-transaactions.dto';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './transaction-created.event';
import {
  RetrievedTransactionDTO,
  TransactionStatusDTO,
  TransactionTypeDTO,
} from './dtos/retrive-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionsClient: ClientKafka,
  ) {}

  async createTransaction(transaction: CreateTransactionDTO) {
    const newTransaction = this.transactionRepository.create(transaction);
    const newTransactionRepository = await this.transactionRepository.save(
      newTransaction,
    );
    this.transactionsClient.emit(
      'transaction_created',
      new TransactionCreatedEvent(
        newTransactionRepository.id,
        process.env.TRANSACTION_PENDING_STATUS,
        newTransactionRepository.value,
      ),
    );
    return transaction;
  }

  async fetchTransactions() {
    return this.transactionRepository.find({});
  }

  async getTransactionById(id: string) {
    const retrievedTransaction = await this.transactionRepository.findOneBy({
      id: id,
    });

    const transactionTypeDTO = new TransactionTypeDTO();
    const transactionStatusDTO = new TransactionStatusDTO();
    const retrievedTransactionDTO = new RetrievedTransactionDTO();

    transactionTypeDTO.name = String(retrievedTransaction.tranferTypeId);
    transactionStatusDTO.name = retrievedTransaction.status;

    retrievedTransactionDTO.transactionExternalId = retrievedTransaction.id;
    retrievedTransactionDTO.value = retrievedTransaction.value;
    retrievedTransactionDTO.createdAt = retrievedTransaction.createdAt;
    retrievedTransactionDTO.transactionType = transactionTypeDTO;
    retrievedTransactionDTO.transactionStatus = transactionStatusDTO;

    return retrievedTransactionDTO;
  }

  async updateTransactionStatus(transactionId: string, status: string) {
    const transactionRepository = await this.transactionRepository.update(
      transactionId,
      { status: status },
    );
    return transactionRepository;
  }
}
