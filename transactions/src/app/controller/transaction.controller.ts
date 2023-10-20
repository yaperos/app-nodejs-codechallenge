import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateTransactionRequestDto } from "../../common/dtos/request/create-transaction.dto";
import { TransactionResponse } from "../../common/dtos/response/transaction.response.dto";
import { AppRoutes } from "../../common/routes/app.routes";
import { TransactionService } from "../../core/transaction.service";



@Controller(AppRoutes.transaction)
export class TransactionController {

    constructor (private readonly transactionService: TransactionService){}

    @Post()
    async create(@Body() request: CreateTransactionRequestDto) : Promise<TransactionResponse>{
        return this.transactionService.create(request);
    }

    @Get(':id')
    async retrieveTransaction(@Param('id') id: string,) : Promise<TransactionResponse>{
        return this.transactionService.retrieve(id)
    }
}