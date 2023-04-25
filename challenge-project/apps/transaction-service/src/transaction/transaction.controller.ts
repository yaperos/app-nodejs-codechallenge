import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionFindoneDto, TransactionQueryDto, TransactionRequestDto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionApprovedEvent, TransactionRejectedEvent } from '@app/common/events';

@Controller('transactions')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @Post()
    createTransaction(@Body() dto: TransactionRequestDto) {
        return this.transactionService.createTransaction(dto);
    }

    @Get()
    getTransactions(@Query() query: TransactionQueryDto) {
        return this.transactionService.getTransactions(query);
    }

    @Get(':id')
    getTransactionById(@Param() params: TransactionFindoneDto) {
        return this.transactionService.getTransactionByExternalId(params.id);
    }

    @MessagePattern('transaction-approved')
    public transactionApproved(@Payload() payload: TransactionApprovedEvent) {
        Logger.log(payload)
        this.transactionService.handleTransactionApproved(payload);
    }

    @MessagePattern('transaction-rejected')
    public transactionRejected(@Payload() payload: TransactionRejectedEvent) {
        Logger.log(payload)
        this.transactionService.handleTransactionRejected(payload);
    }
}
