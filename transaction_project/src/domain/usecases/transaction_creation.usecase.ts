import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
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

  create(transaction: Transaction) {
    console.log(
      'TransactionCreationUsecase: Create a transaction: ' +
        JSON.stringify(transaction),
    );

    return this.transactionService.create(transaction).pipe(
      map((tx) => {
        console.log(
          'TransactionCreationUsecase: Create a transaction: ' +
            JSON.stringify(tx),
        );

        // Notify Antifraud to check the transaction.
        const payload: AntifraudCheckPayload = {
          transactionId: tx.transactionExternalId,
        };

        console.log(
          `TransactionCreationUsecase: before sending to Antifraud:  ${JSON.stringify(
            payload,
          )}`,
        );
        this.messagingService.notifyAntifraudSystem(payload);
        return tx;
      }),
    );
  }
}
