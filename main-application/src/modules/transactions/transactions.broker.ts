import { Controller } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Events } from './types/transaction-types-enums';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TransactionDto } from './dtos/transaction.dto';

@Controller()
export class TransactionsBroker {
    constructor(private readonly transactionsService: TransactionsService) { }


    @MessagePattern(Events.ON_TRANSACTION_COMPLETE)
    async onTransactionCreate(payload) {
        const { _id, ...updatePayload } = payload;
        console.log(`4:: INFORMATION RECEIVED (${updatePayload.transactionStatus}) FROM MICROSERVICE BROKER, UPDATING TRANSACTION`);
        await this.transactionsService.update(_id, updatePayload);
    }

    @MessagePattern(Events.ON_TRANSACTION_REJECT)
    async onTransactionReject(payload) {
        const { _id, ...updatePayload } = payload;
        console.log(`4:: INFORMATION RECEIVED (${updatePayload.transactionStatus}) FROM MICROSERVICE BROKER, UPDATING TRANSACTION`);
        await this.transactionsService.update(_id, updatePayload);
    }
}
