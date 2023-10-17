import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { ITransactionMessage} from 'src/interfaces/transaction-message.interface'
import  {TRANSACTION_STATUS} from 'src/constants/transaction-status'

@Injectable()
export class TransactionService {
    constructor(
      private producerService: ProducerService
      ) {}

    async validateTransaction(transactionInfo:ITransactionMessage) {
        const topic:string =  (transactionInfo.value > 1000)? TRANSACTION_STATUS.REJECTED : TRANSACTION_STATUS.APROVED       
       // Send transaction Status Approved or Rejected
        this.producerService.produce({
          topic: topic,
          messages: [{ value: JSON.stringify(transactionInfo) }],         
        });
      }
}
