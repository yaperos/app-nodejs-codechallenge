import { Body, Controller, Get, Logger, Post, UseInterceptors } from "@nestjs/common";
import { TRANSACTION, TRANSACTION_RECEIVED } from "./constants/constants";
import { MessagePattern } from "@nestjs/microservices";
import TransactionService from "./transactions.service";
import { IncomingTransaction } from "./dto/transactions.dto";
import { DataValidationInterceptor } from "src/interceptors/dataValidationInterceptor";

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
    @UseInterceptors(DataValidationInterceptor)
    public async createTransaction(@Body() data:IncomingTransaction): Promise<any> {
        const response = await this.transactionService.createTransaction(data);
        return response;
    }

    @MessagePattern(TRANSACTION_RECEIVED)
    private async handleModifiedOrder(data: Record<string, unknown>){
        this.logger.log(data)

    }


}