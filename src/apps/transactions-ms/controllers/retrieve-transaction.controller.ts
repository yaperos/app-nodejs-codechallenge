import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RetrieveTransactionUsecase } from 'src/contexts/transactions-ms/transaction/application/create/retrieve-transaction.usecase';
import { TransactionResponseDto } from 'src/contexts/transactions-ms/transaction/infraestructure/dtos/transaction-response.dto';

@ApiTags('Retrieve transaction')
@Controller('transactions')
export class RetrieveTransactionController {
    constructor(private readonly usecase: RetrieveTransactionUsecase) {}

    @Get('/:id')
    @ApiOperation({ summary: 'Retrieves a transaction info' })
    public getTransaction(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<TransactionResponseDto> {
        return this.usecase.getTransactionData(id);
    }
}
