import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagingService } from 'src/adapter/input_output/messaging/mesaging.service';
import { TransactionService } from '../../adapter/output/db/transaction.service';
import { Transaction } from '../models/transaction.interface';
import { AntifraudCheckPayload } from './antifraud_check.payload';

@Injectable()
export class TransactionCreationUsecase {
  constructor(
    private readonly configService: ConfigService,
    private transactionService: TransactionService,
    private readonly messagingService: MessagingService,
  ) {}

  async create(transaction: Transaction) {
    console.log(
      'TransactionCreationUsecase: Create a transaction: ' +
        JSON.stringify(transaction),
    );
    const created: Transaction = await this.transactionService.create(
      transaction,
    );

    console.log(
      'TransactionCreationUsecase: Created: ' + JSON.stringify(created),
    );

    // TODO: check result

    // Notify Antifraud to check the transaction.
    const payload: AntifraudCheckPayload = {
      transactionId: created.transactionExternalId,
    };

    console.log(
      `TransactionCreationUsecase: before sending to Antifraud:  ${JSON.stringify(
        payload,
      )}`,
    );

    await this.messagingService.sendToAntifraud(payload);

    return transaction;
  }
}
