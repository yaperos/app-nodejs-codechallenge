import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatus } from 'src/common/enums/transaction';
import { Repository } from 'typeorm';
import { CreateTransactionInput } from '../dto/inputs/create-transaction.input';
import { UpdateTransactionInput } from '../dto/inputs/update-transaction.input';
import { TransformedTransaction } from '../dto/responses/transformed-transaction-response.dto';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(process.env.ANTIFRAUD_KAFKA_NAME)
    private antifraudClient: ClientKafka,
  ) { }

  async create(createTransactionInput: CreateTransactionInput) {
    const newTransaction = this.transactionRepository.create(createTransactionInput);
    const savedTransaction = await this.transactionRepository.save(newTransaction);

    await this.emitTransactionCreatedEvent(savedTransaction);
    return savedTransaction;
  }

  private async emitTransactionCreatedEvent(transaction: Transaction) {
    try {
      this.antifraudClient.emit('transaction.created', JSON.stringify({
        id: transaction.id,
        value: transaction.value,
      }));
    } catch (error) {
      console.error('Error emitting transaction created event:', error);
    }
  }

  async findAll() {
    const transactions = await this.transactionRepository.find();
    const transformedTransactions: TransformedTransaction[] = transactions.map(transaction => (
      this.transformTransaction(transaction)
    ));
    return transformedTransactions;
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return this.transformTransaction(transaction)
  }

  private transformTransaction(transaction: Transaction): TransformedTransaction {
    return {
      transactionExternalId: transaction.id,
      transactionType: { name: "Tipo de transacción" },
      transactionStatus: { name: TransactionStatus[transaction.transactionStatus] },
      value: transaction.value,
      createdAt: transaction.createdAt.toString(),
    };
  }

  async update(id: string, updateTransactionInput: UpdateTransactionInput) {
    await this.findOne(id);
    const transaction = await this.transactionRepository.preload(updateTransactionInput);
    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return this.transactionRepository.save(transaction);
  }
}
