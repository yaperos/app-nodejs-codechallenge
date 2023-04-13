import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  transactionDocument,
  transactionModel,
  TransactionStatus,
} from '../schema/transaction.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { transactionDTO } from '../controller/transaction.controller';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import { BalanceService } from '../../balances/service/balance.service';

@Injectable()
export class TransactionService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectModel(transactionModel.name)
    private readonly transactionModel: Model<transactionDocument>,
    @Inject('TRANSACTION_SERVICE') private readonly client: ClientKafka,
    @Inject(BalanceService) private readonly balanceService: BalanceService,
  ) {}

  async onModuleDestroy() {
    await this.client.close();
  }

  async getTransaction(transactionID: string): Promise<transactionModel> {
    return this.transactionModel.findOne({
      transactionExternalId: transactionID,
    });
  }

  async createTransaction(transaction: transactionDTO) {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      amount,
      transferTypeId,
    } = transaction.payload;
    const transactionId = transaction.requestId;
    const payload = {
      transactionExternalId: transactionId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      amount,
      transferTypeId,
    };
    await this.transactionModel.create(payload);

    const balanceVerification = await this.balanceService.updateUserBalance(
      accountExternalIdDebit,
      amount,
      accountExternalIdCredit,
    );
    const amountVerification = await lastValueFrom(
      this.client.send('transaction.verify', {
        transactionExternalId: transactionId,
        transactionAmount: amount,
      }),
    );
    await this.updateTransaction(transactionId, {
      ...payload,
      transactionStatus:
        amountVerification.isValid && balanceVerification.hasEnough
          ? TransactionStatus.COMPLETED
          : TransactionStatus.FAILED,
    });
    return this.getTransaction(transactionId);
  }

  async updateTransaction(
    transactionID: string,
    newTransaction: any,
  ): Promise<any> {
    return this.transactionModel.findOneAndUpdate(
      { transactionExternalId: transactionID },
      newTransaction,
    );
  }

  async onModuleInit() {
    this.client.subscribeToResponseOf('transaction.verify');
    await this.client.connect();
  }
}
