import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findOne(id: string): Promise<Transaction> {
    const foundTransacion = await this.transactionRepository.findOne({
      where: { id },
    });
    return foundTransacion;
  }

  async createTransaction(
    transaction: CreateTransactionDto,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create(transaction);
    return this.transactionRepository.save(newTransaction);
  }

  validate(transaction: Transaction) {
    return this.transactionClient.send('validate_transaction', {
      id: transaction.id,
      amount: transaction.value,
    });
  }

  async update(updateTransaction: UpdateTransactionDto): Promise<boolean> {
    console.log('updateTransaction', updateTransaction);
    const updatedAt = new Date();
    const newUpdate = { status: updateTransaction.status, updatedAt };
    await this.transactionRepository.update(
      { id: updateTransaction.id },
      newUpdate,
    );
    return true;
  }
  onModuleInit() {
    this.transactionClient.subscribeToResponseOf('validate_transaction');
  }
}
