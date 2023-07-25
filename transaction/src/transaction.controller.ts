import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @Get()
    getAllTransactions() {
        return this.transactionService.getAll();
    }

    @Get(':id')
    getTransactionById(@Param('id') id: string) {
        return this.transactionService.getById(id);
    }

    @Post()
    createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionService.create(createTransactionDto);
    }

    @Patch(':id')
    updateTransaction(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
        return this.transactionService.update(id, updateTransactionDto);
    }

    @Delete(':id')
    deleteTransaction(@Param('id') id: string) {
        return this.transactionService.delete(id);
    }
}
