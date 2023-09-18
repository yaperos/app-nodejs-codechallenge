import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// DTO
import { ResponseGetTransactionDto } from '../dto/response_get_transaction.dto';
// Entities
import { Transaction } from '../entities/transaction.entity';
// Utilities
import { TransactionTypesUtility } from '../utilities/transactionTypes.utility';
// INterfaces
import { ResponseErrorInterface } from 'src/../start/interfaces/responseError.interface';

@Injectable()
export class GettingTransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    private readonly transactionTypeUtility: TransactionTypesUtility,
  ) {}

  /**
   * Obtener los datos de una trasacción
   */
  async getTransaction(
    transactionExternalId: string,
  ): Promise<ResponseGetTransactionDto | ResponseErrorInterface> {
    try {
      const transaction = await this.transactionModel.findById(
        transactionExternalId,
      );
      if (!transaction) {
        return {
          status: 400,
          details: 'transaction not found',
        };
      }
      const responseTransaction: ResponseGetTransactionDto = {
        transactionExternalId,
        transactionType: {
          name: this.transactionTypeUtility.getTransactionTypeName(
            transaction.tranferTypeId,
          ),
        },
        transactionStatus: {
          name: transaction.status,
        },
        value: transaction.value,
        createdAt: transaction.created_at,
      };
      return responseTransaction;
    } catch (error) {
      Logger.debug(error);
    }
    return {
      status: 500,
      details: 'internal error',
    };
  }
}
