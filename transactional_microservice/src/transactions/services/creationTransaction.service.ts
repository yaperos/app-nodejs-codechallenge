import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
// DTO
import { CreateTransactionDto } from '../dto/create_transaction.dto';
// Entities
import { Transaction } from '../entities/transaction.entity';
// Services
import { DataupdateService } from './dataupdate.service';

@Injectable()
export class CreationTransactionService {
  constructor(
    @Inject('SERVER')
    private readonly clientKafka: ClientProxy,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    private readonly dataupdateService: DataupdateService,
  ) {}

  /**
   * INICIALIZA
   */
  public async runCreateTransaction(
    payload: CreateTransactionDto,
  ): Promise<any> {
    const newTransaction = await this.createNewTransaction(payload);
    await this.emitKafka(newTransaction);
    return newTransaction;
  }
  /**
   * Registra la transacción en la BD
   */
  private async createNewTransaction(
    payload: CreateTransactionDto,
  ): Promise<Transaction> {
    const currentStatus = 'PENDING';
    const transactionInserted = await this.transactionModel.create(payload);
    return await this.dataupdateService.updateStatusTransaction(
      transactionInserted._id.toString(),
      currentStatus,
    );
  }

  /**
   * Emite el evento
   */
  private async emitKafka(transaction: Transaction): Promise<boolean> {
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
