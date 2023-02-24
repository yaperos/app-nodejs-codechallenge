import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateTransactionUsecase } from '../../../contexts/transactions-ms/transaction/application/create/create-transaction.usecase';
import { TransactionModel } from '../../../contexts/transactions-ms/transaction/domain/transaction.model';
import { CreateTransactionDto } from '../../../contexts/transactions-ms/transaction/infraestructure/dtos/create-transaction.dto';

@ApiTags('Create transaction')
@Controller('transactions')
export class CreateTransactionController {
    constructor(private readonly usecase: CreateTransactionUsecase) {}

    @Post('')
    @ApiOperation({ summary: 'Creates a transaction' })
    public create(
        @Body() createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionModel> {
        return this.usecase.createTransaction(createTransactionDto);
    }
}
