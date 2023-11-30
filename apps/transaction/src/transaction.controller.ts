import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

import { ITRANSACTION_STATUSES, TRANSACTION_EVENTS } from '@app/constants';
import { TransactionService } from './services/transaction.service';

@Controller()
export class TransactionController implements OnModuleInit {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('ANTI_FRAUD_SERVICE') private readonly antiFraudClient: ClientKafka,
  ) {}
  async onModuleInit() {
    this.antiFraudClient.subscribeToResponseOf(TRANSACTION_EVENTS['APRROVED']);
    this.antiFraudClient.subscribeToResponseOf(TRANSACTION_EVENTS['REJECTED']);
    await this.antiFraudClient.connect();
  }

  @EventPattern('transaction_approved')
  async onGetTransactionApproved(transactionId: string) {
    console.log('hola');
    const status: ITRANSACTION_STATUSES = 'APRROVED';
    return await this.transactionService.transactionStatusHandler(
      status,
      transactionId,
    );
  }

  @EventPattern('transaction_rejected')
  async onGetTransactionRejected(transactionId: string) {
    console.log('alg');
    const status: ITRANSACTION_STATUSES = 'REJECTED';
    return await this.transactionService.transactionStatusHandler(
      status,
      transactionId,
    );
  }
}
