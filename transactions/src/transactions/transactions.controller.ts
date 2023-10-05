import { Body, Controller, Get, Logger, Post, UseInterceptors } from "@nestjs/common";
import { TRANSACTION } from "./constants/constants";
import { EventPattern } from "@nestjs/microservices";
import TransactionService from "./transactions.service";    
import { CreatedTransaction, EmitTransactionToValidation, IncomingTransaction } from "./dto/transactions.dto";
import { ANTI_FRAUD_VALIDATION, TRANSACTION_CREATED } from "./constants/patterns";

@Controller(TRANSACTION)
export default class TransactionController{
    private logger:Logger;
    constructor(private readonly transactionService: TransactionService){
        this.logger = new Logger(TransactionController.name)
    }

    
    @EventPattern(TRANSACTION_CREATED)
    private async handleModifiedOrder(data: IncomingTransaction){
        const savedTransaction: EmitTransactionToValidation = await this.transactionService.createTransaction(data);
        this.transactionService.emitEventToKafkaTopic(ANTI_FRAUD_VALIDATION, savedTransaction);
        this.logger.log(data)
    }


}