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
  public async runUpdateStatusTransaction(
    payloadEmited: EmitedUpdateTransactionDto,
  ): Promise<Transaction> {
    return await this.updateStatusTransaction(
      payloadEmited.transaction_id,
      payloadEmited.new_status,
    );
  }
  /**
   * Actualiza la transacción en la BD
   */
  public async updateStatusTransaction(
    transaction_id: string,
    new_status: string,
  ): Promise<Transaction> {
    try {
      return await this.transactionModel.findOneAndUpdate(
        { _id: transaction_id },
        {
          $set: { status: new_status },
          $push: {
            tracking: {
              status: new_status,
              triggered_at: new Date(),
            },
          },
        },
      );
    } catch (error) {
      Logger.error(error);
    }
    return null;
  }
}
