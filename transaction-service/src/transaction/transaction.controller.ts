import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionRequestDto } from './dto';

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
}
