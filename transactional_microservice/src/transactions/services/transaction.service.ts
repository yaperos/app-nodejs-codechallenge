import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
// DTO
import { CreateTransactionDto } from '../dto/create_transaction.dto';
// Entities
import { Transaction } from '../entities/transaction.entity';

const topic: string = 'transaction-topic';
@Injectable()
export class TransactionService {
  constructor(
    @Inject('SERVER')
    private readonly clientKafka: ClientProxy,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
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
    const currentStatus = 'PENDING';
    const firstTrack = { status: currentStatus, triggered_at: new Date() };
    const defaultTransaction = Object.assign(payload, {
      status: currentStatus,
      tracking: [firstTrack],
    });
    return await this.transactionModel.create(defaultTransaction);
  }

  async emitKafka(transaction: Transaction): Promise<boolean> {
    console.log('emitKafka', transaction);
    const payloadKafka = {
      transaction_id: transaction._id,
      last_status: transaction.status,
    };
    try {
      const r = await this.clientKafka.emit(topic, payloadKafka);
      console.log('r', r);
    } catch (error) {
      console.log('error', error);
      return false;
    }
    return true;
  }
}
