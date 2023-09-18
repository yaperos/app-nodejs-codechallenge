import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
// DTO
import { EmitedCreateTransactionDto } from '../dto/emited_create_transaction.dto';
// Entities
import { Transaction } from '../entities/transaction.entity';

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
    const statuses: [string, string] = ['REJECTED', 'APPROVED'];
    let isFraud: boolean = false;
    try {
      const transaction = await this.transactionModel.findById(
        payloadEmited.transaction_id,
      );
      if (!transaction) {
        throw ReferenceError(
          `Transaction "${payloadEmited.transaction_id}" not found`,
        );
      }
      isFraud = transaction.value > 100;
    } catch (error) {
      Logger.debug(error);
    }
    return isFraud ? statuses[0] : statuses[1];
  }

  /**
   * Emite el evento
   */
  async emitKafka(
    payloadEmited: EmitedCreateTransactionDto,
    newStatus: string,
  ): Promise<boolean> {
    const payloadKafka = {
      transaction_id: payloadEmited.transaction_id,
      new_status: newStatus,
    };
    try {
      console.log('> payloadKafka ->transaction.validate', payloadKafka);
      this.clientKafka.emit('transaction.validate', payloadKafka);
    } catch (error) {
      Logger.error(error);
      return false;
    }
    return true;
  }
}
