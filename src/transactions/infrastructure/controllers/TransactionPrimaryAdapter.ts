import { Controller, Post, Get, Body, Logger, Param } from '@nestjs/common';
import { TransactionUseCases } from '../../application/useCases/TransactionUseCase';
import { TransactionDTO } from '../../domain/dtos/transactionDto';
import {
  TransactionDocument,
  TransactionResponse,
} from '../../domain/entities/transaction';
import { TransactionSecondaryAdapter } from '../adapters/implements/TransactionSecondaryAdapter';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Controller('transactions')
export class TransactionController {
  private logger = new Logger('TransactionController');
  private readonly _useCases: TransactionUseCases;
  private transactionAdapter: Model<TransactionDocument>;
  constructor(
    @InjectModel('Transaction')
    transactionModel: Model<TransactionDocument>,
  ) {
    this.transactionAdapter = transactionModel;
    const secondaryPort = new TransactionSecondaryAdapter(
      this.transactionAdapter,
    );
    this._useCases = new TransactionUseCases(secondaryPort);
  }

  @Post()
  async createTransaction(
    @Body() transactionDto: TransactionDTO,
  ): Promise<TransactionResponse> {
    try {
      const result = await this._useCases.createTransaction(transactionDto);
      this.logger.log(`Transaction created: ${result.transactionExternalId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create transaction: ${error.message}`);
      throw error;
    }
  }

  @Get(':transactionExternalId')
  async getTransaction(
    @Param('transactionExternalId') transactionExternalId: string,
  ): Promise<TransactionResponse | Error> {
    const transaction = await this._useCases.getTransaction(
      transactionExternalId,
    );
    if (!transaction) {
      return new Error("transaction doesn't exist");
    }
    const transactionResource: TransactionResponse = {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus.name,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
    return transactionResource;
  }
}
