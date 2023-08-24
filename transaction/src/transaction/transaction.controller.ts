import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { TransactionRequest } from './transaction.dto';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @MessagePattern('get_transactions')
    handlerGetTransactions() {
        return this.transactionService.handlerGetTransactions();
    }

    @MessagePattern('transaction_created')
    handlerTransactionCreated(data: TransactionRequest) {
        return this.transactionService.handlerTransactionCreated(data);
    }

    @EventPattern('anti_fraud_validated')
    handlerAntiFraudValidated(response: any) {
        this.transactionService.handlerAntiFraudValidated(response);
    }
}
