import { Body, Controller, Get, Logger, Post, UseInterceptors } from "@nestjs/common";
import { TRANSACTION, TRANSACTION_CREATED } from "./constants/constants";
import { EventPattern } from "@nestjs/microservices";
import TransactionService from "./transactions.service";    
import { CreatedTransaction, IncomingTransaction } from "./dto/transactions.dto";
import { DataValidationInterceptor } from "src/interceptors/dataValidationInterceptor";

@Controller(TRANSACTION)
export default class TransactionController{
    private logger:Logger;
    constructor(private readonly transactionService: TransactionService){
        this.logger = new Logger(TransactionController.name)
    }

    @EventPattern(TRANSACTION_CREATED) //@MessagePattern(TRANSACTION_RECEIVED)
    private async handleModifiedOrder(data:any){
        this.logger.log(data)


    }


}