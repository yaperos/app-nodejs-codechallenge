import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// DTO
import { EmitedUpdateTransactionDto } from '../dto/emited_update_transaction.dto';
// Entities
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class DataupdateService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  /**
   * INICIALIZA
   */
  async runUpdateStatusTransaction(
    payloadEmited: EmitedUpdateTransactionDto,
  ): Promise<boolean> {
    Logger.debug('> runUpdateStatusTransaction->payloadEmited', payloadEmited);
    return await this.updateStatusTransaction(payloadEmited);
  }
  /**
   * Actualiza la transacción en la BD
   */
  async updateStatusTransaction(
    payloadEmited: EmitedUpdateTransactionDto,
  ): Promise<boolean> {
    try {
      await this.transactionModel.updateOne(
        { _id: payloadEmited.transaction_id },
        { $set: { status: payloadEmited.new_status } },
      );
      return true;
    } catch (error) {
      Logger.error(error);
    }
    return false;
  }
}
