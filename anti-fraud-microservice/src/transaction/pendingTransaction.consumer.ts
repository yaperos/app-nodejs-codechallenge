import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ITransactionMessage} from 'src/interfaces/transaction-message.interface';
import  {TRANSACTION_STATUS} from 'src/constants/transaction-status';
import  {CONSUMER_GROUP} from 'src/constants/consumer-group'
import { TransactionService } from './transaction.service';

@Injectable()
export class PendingTransactionConsumer implements OnModuleInit {
  constructor(
    private consumerService: ConsumerService,
    private transactionService: TransactionService,
    ) {} 

  async onModuleInit() {
    this.consumerService.consume(
      CONSUMER_GROUP.PENDING_TRANSACTION_CONSUMER_GROUP,
      { topic: TRANSACTION_STATUS.PENDING },
      {
        eachMessage: async ({ message }) => {
          const msg = JSON.parse(message.value.toString())
          const transactionInfo: ITransactionMessage = {
            id: msg.id,
            accountExternalIdDebit: msg.accountExternalIdDebit,
            accountExternalIdCredit: msg.accountExternalIdCredit,
            value: msg.value,
            transactionStatusId: msg.transactionStatusId,
            tranferTypeId: msg.tranferTypeId}
          await this.transactionService.validateTransaction(transactionInfo);
        },
      },
    );
  }
}
