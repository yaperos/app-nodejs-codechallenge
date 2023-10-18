import { Inject, Injectable } from '@nestjs/common';
import { MessageBrokerDto } from 'apps/shared/message-broker.dto';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { TransactionRepository } from '../../domain/transaction.repository';

@Injectable()
export class TransactionEventHandler {
  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository) { }

  async handleTransactionValidated(message: MessageBrokerDto<Boolean>) {
    const status = message.data ? TransactionStatus.APPROVED : TransactionStatus.REJECTED;
    await this.transactionRepository.updateStatus(message.idTransaction, status);
  }
}