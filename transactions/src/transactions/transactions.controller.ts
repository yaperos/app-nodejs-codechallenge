import { Body, Controller, Get, Logger, Post, UseInterceptors } from "@nestjs/common";
import { TRANSACTION } from "./constants/constants";
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

    @Get()
    public async getAllTransactions(): Promise<CreatedTransaction[]> {
        return await this.transactionService.getAllTransactions();
    }

    @Post()
    @UseInterceptors(DataValidationInterceptor)
    public async createTransaction(@Body() data:IncomingTransaction): Promise<any> {
        const response = await this.transactionService.createTransaction(data);
        return response;
    }

    @EventPattern(TRANSACTION) //@MessagePattern(TRANSACTION_RECEIVED)
    private async handleModifiedOrder(data:any){
        this.logger.log(data)


    }


}