import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AntiFraudMessage } from "./entities/antiFraud.message";
import { TransactionService } from "./transaction.service";

@Controller()
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
    ) {}

    @MessagePattern('transaction.validated')
    async updateTransactionStatus(@Payload() payload: AntiFraudMessage): Promise<void> {
        Logger.log(payload);
        await this.transactionService.updateTransactionStatus(payload);
    }
}
