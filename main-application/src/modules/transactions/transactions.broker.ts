import { Controller } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Events } from './types/transaction-types-enums';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class TransactionsBroker {
    constructor(private readonly transactionsService: TransactionsService) { }


    @MessagePattern(Events.ON_TRANSACTION_COMPLETE)
    @MessagePattern(Events.ON_TRANSACTION_REJECT)
    async onTransactionCreate(stringifiedPayload) {
        const { _id, ...updatePayload } = stringifiedPayload;
        await this.transactionsService.update(_id, updatePayload);
    }
}
