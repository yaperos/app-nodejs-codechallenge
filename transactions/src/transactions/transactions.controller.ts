import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { TRANSACTION, TRANSACTION_RECEIVED } from "./constants/constants";
import { MessagePattern } from "@nestjs/microservices";
import TransactionService from "./transactions.service";

@Controller(TRANSACTION)
export default class TransactionController{
    private logger:Logger;
    constructor(private readonly transactionService: TransactionService){
        this.logger = new Logger(TransactionController.name)
    }

    @Get()
    public getAllTransactions(): number {
        return 0
    }

    @Post()
    public createTransaction(@Body() data:any): number {
        this.transactionService.emitValidateTransaction(data);
        return 0
    }

    @MessagePattern(TRANSACTION_RECEIVED)
    private async handleModifiedOrder(data: Record<string, unknown>){
        this.logger.log(data)

    }


}