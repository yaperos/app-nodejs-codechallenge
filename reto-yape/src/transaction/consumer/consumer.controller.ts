import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { TransactionService } from '../service/transaction.service';

@Controller('consumer')
export class ConsumerController {

    constructor(
        private transactionS: TransactionService,
    ) { }

    @EventPattern('transaction_updated')
    handlerTransactionUpdated(data: any) {
        console.log("==========UPDATED EVENT TRANSACTION");
        console.log(data);
        const { message } = data;
        this.transactionS.updated(message.transactionExternalId, message.transactionStatusId);
    }
}
