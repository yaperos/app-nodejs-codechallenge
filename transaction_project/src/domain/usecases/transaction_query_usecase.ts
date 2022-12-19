import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';
import { TransactionService } from '../../adapter/output/db/transaction.service';

@Injectable()
export class TransactionQueryUsecase {
  constructor(
    private readonly configService: ConfigService,
    private transactionService: TransactionService,
  ) {}

  findById(transactionId: string) {
    console.log(
      'TransactionQueryUsecase: transactionId: ' +
        JSON.stringify(transactionId),
    );

    return this.transactionService.findById(transactionId).pipe(
      map((tx) => {
        if (!tx) {
          throw new NotFoundException('Transaction not found');
        }
        console.log(
          'TransactionQueryUsecase: Get transaction: ' + JSON.stringify(tx),
        );
        return tx;
      }),
    );
  }
}
