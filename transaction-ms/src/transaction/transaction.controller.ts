import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { PrismaSelect } from "@paljs/plugins";
import { MessageBrokerDto } from "./kafka/dtos/message-broker.dto";
import { TransactionService } from "./transaction.service";


interface TransactionStatusContent {
    id: string;
    isValid: boolean;
}

@Controller()
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
    ) {}


    @EventPattern('transaction.validated')
    async updateTransactionStatus(@Payload() message: MessageBrokerDto<TransactionStatusContent>){
        try {
            await this.transactionService.updateTransactionStatus({
                status: message.content.isValid ? 'APPROVED' : 'REJECTED',
                id: message.content.id,
            });
        } catch (error) {
            Logger.error('error updating transaction', error)
        }
    }
    }