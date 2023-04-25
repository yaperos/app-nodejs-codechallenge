import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRequestDto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionApprovedEvent, TransactionRejectedEvent } from '@app/common/events';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @Post()
    createTransaction(@Body() dto: TransactionRequestDto) {
        return this.transactionService.createTransaction(dto);
    }

    @Get(':id')
    getTransactionById(@Param('id') id: string) {
        return this.transactionService.getTransactionByExternalId(id);
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
