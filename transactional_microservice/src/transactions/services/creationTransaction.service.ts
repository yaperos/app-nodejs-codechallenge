import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
// DTO
import { CreateTransactionDto } from '../dto/create_transaction.dto';
// Entities
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class CreationTransactionService {
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
    const newTransaction = await this.createNewTransaction(payload);
    await this.emitKafka(newTransaction);
    return newTransaction;
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

  /**
   * Emite el evento
   */
  async emitKafka(transaction: Transaction): Promise<boolean> {
    const payloadKafka = {
      transaction_id: transaction._id,
      last_status: transaction.status,
    };
    try {
      this.clientKafka.emit('transaction.create', payloadKafka);
    } catch (error) {
      Logger.error(error);
      return false;
    }
    return true;
  }
}
