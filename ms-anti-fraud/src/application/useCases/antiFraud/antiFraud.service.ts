import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { msConfig } from '../../../infraestructure/config';
import {
  MAXIMUM_AMOUNT_TRANSFER,
  TRANSACTION_STATUS_ID,
} from 'src/application/constant';
import { TransactionInterface } from 'src/domain/transaction/transaction.model';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  constructor(
    @Inject(msConfig.nameAntiFraud) private readonly clientKafka: ClientKafka,
  ) {}

  onModuleInit() {
    this.clientKafka.subscribeToResponseOf(
      `${msConfig.nameAntiFraud}-created-transaction`,
    );
  }

  verifyTransaction(trx: TransactionInterface): void {
    trx.status =
      MAXIMUM_AMOUNT_TRANSFER > trx.value
        ? TRANSACTION_STATUS_ID.ACCEPTED
        : TRANSACTION_STATUS_ID.REJECTED;
  }
}
