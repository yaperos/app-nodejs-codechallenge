import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import  {TRANSACTION_STATUS} from 'src/constants/transaction-status';
import  {CONSUMER_GROUP} from 'src/constants/consumer-group'
import { TransactionService } from './transaction.service';
import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';
import { UpdateTransactionInput} from 'src/transaction/dto/update-transaction.input'

@Injectable()
export class ApprovedTransactionConsumer implements OnModuleInit {
  constructor(
    private consumerService: ConsumerService,
    private transactionService: TransactionService,
    private transactionStatusService: TransactionStatusService
    ) {}  

  async onModuleInit() {
    this.consumerService.consume(
      CONSUMER_GROUP.APROVED_TRANSACTION_CONSUMER_GROUP,
      { topic: TRANSACTION_STATUS.APROVED },
      {
        eachMessage: async ({message }) => {
          const msg = JSON.parse(message.value.toString());
          const transactionStatus = await this.transactionStatusService.findOneByName(TRANSACTION_STATUS.APROVED);
          const transaction = new UpdateTransactionInput();
          transaction.id = msg.id;
          transaction.accountExternalIdDebit = msg.accountExternalIdDebit;
          transaction.accountExternalIdCredit = msg.accountExternalIdCredit;
          transaction.value = msg.value;
          transaction.transactionStatusId = transactionStatus.id;
          transaction.tranferTypeId = msg.tranferTypeId
         
          await this.transactionService.update(transaction.id, transaction);
        },
      },
    );
  }
}
