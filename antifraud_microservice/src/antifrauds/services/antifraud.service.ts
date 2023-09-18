import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
// DTO
import { EmitedCreateTransactionDto } from '../dto/emited_create_transaction.dto';
// Entities
import { Transaction } from '../entities/transaction.entity';

// const topic: string = 'transaction.create';
@Injectable()
export class AntifraudService {
  constructor(
    @Inject('SERVER')
    private readonly clientKafka: ClientProxy,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  /**
   * INICIALIZA
   */
  async runValidateTransaction(
    payloadEmited: EmitedCreateTransactionDto,
  ): Promise<any> {
    const newStatus = await this.validateTransaction(payloadEmited);
    return await this.emitKafka(payloadEmited, newStatus);
  }
  /**
   * Registra la transacción en la BD
   */
  async validateTransaction(
    payloadEmited: EmitedCreateTransactionDto,
  ): Promise<string> {
    const value = 100;
    const isFraud: boolean = value > 100;
    const statuses: [string, string] = ['REJECTED', 'APPROVED'];
    return isFraud ? statuses[0] : statuses[1];
  }

  async emitKafka(
    payloadEmited: EmitedCreateTransactionDto,
    newStatus: string,
  ): Promise<boolean> {
    const payloadKafka = {
      transaction_id: payloadEmited.transaction_id,
      new_status: newStatus,
    };
    try {
      console.log('> payloadKafka', payloadKafka);

      const r = this.clientKafka.emit('transaction.validate', payloadKafka);
      console.log('r', r);
    } catch (error) {
      console.log('error', error);
      return false;
    }
    return true;
  }
}
