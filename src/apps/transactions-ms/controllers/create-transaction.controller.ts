import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUsecase } from 'src/contexts/transactions-ms/transaction/application/create/create-transaction.usecase';
import { Transaction } from 'src/contexts/transactions-ms/transaction/domain/transaction.model';
import { CreateTransactionDto } from 'src/contexts/transactions-ms/transaction/infraestructure/dtos/create-transaction.dto';

@ApiTags('Create transaction')
@Controller('transactions')
export class CreateTransactionController {
    constructor(private readonly usecase: CreateTransactionUsecase) {}

    @Post('')
    @ApiOperation({ summary: 'Creates a transaction' })
    public create(
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<Transaction> {
        return this.usecase.createTransaction(createTransactionDto);
    }
}
