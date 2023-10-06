import { Controller,Logger} from "@nestjs/common";
import { TRANSACTION } from "./constants/constants";
import { EventPattern } from "@nestjs/microservices";
import TransactionService from "./transactions.service";    
import { EmitTransactionToValidation, IncomingTransaction, UpdateTransaction } from "./dto/transactions.dto";
import { ANTI_FRAUD_VALIDATION, TRANSACTION_CREATED, TRANSACTION_UPDATED } from "./constants/patterns";
import { ValidatedTransaction } from "./dto/validatedTransaction.dto";

@Controller(TRANSACTION)
export default class TransactionController{
    private logger:Logger;
    constructor(private readonly transactionService: TransactionService){
        this.logger = new Logger(TransactionController.name)
    }


    @EventPattern(TRANSACTION_UPDATED)
    private async handleValidatedOrder(data: ValidatedTransaction ): Promise<void>{
        const response:UpdateTransaction = await this.transactionService.handleValidatedOrder(data);
        this.logger.log(`Updated Result`);
        console.log(response)
    }
    
    @EventPattern(TRANSACTION_CREATED)
    private async handleNewOrder(data: IncomingTransaction): Promise<void>{
        const savedTransaction: EmitTransactionToValidation = await this.transactionService.createTransaction(data);
        this.transactionService.emitEventToKafkaTopic(ANTI_FRAUD_VALIDATION, savedTransaction);
    }


}