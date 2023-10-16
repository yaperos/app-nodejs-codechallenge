import { Controller } from '@nestjs/common';
import {TransactionService} from "./transaction.service";
import {Ctx, EventPattern, KafkaContext, Payload} from "@nestjs/microservices";;

@Controller('transaction')
export class TransactionController {
    constructor(private readonly _transactionService: TransactionService) {}

    @EventPattern('topic.yape')
    async newTransaction(@Payload() message: any, @Ctx() context: KafkaContext): Promise<void> {
        const originalMessage = context.getMessage();
        console.log(originalMessage.value)
        await this._transactionService.newTransaction(originalMessage.value);
    }
}
