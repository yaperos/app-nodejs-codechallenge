import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// DTO
import { CreateTransactionDto } from '../dto/create_transaction.dto';
// Entities
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>, // @InjectModel(Transaction.name)
    // private transactionCollection: MongoCollection<Transaction>,
  ) {}
  /**
   * INICIALIZA
   */
  async runCreateTransaction(payload: CreateTransactionDto): Promise<any> {
    console.log('payload', payload);
    const newTransaction = await this.createNewTransaction(payload);
    return await this.emitKafka(newTransaction);
  }
  /**
   * Registra la transacción en la BD
   */
  async createNewTransaction(
    payload: CreateTransactionDto,
  ): Promise<Transaction> {
    const defaultTransaction = Object.assign(payload, {
      status: 'PENDING',
      tracking: [],
    });
    return await this.transactionModel.create(defaultTransaction);
  }
  async emitKafka(transaction: Transaction): Promise<boolean> {
    console.log('emitKafka', transaction);
    return true;
  }
}
