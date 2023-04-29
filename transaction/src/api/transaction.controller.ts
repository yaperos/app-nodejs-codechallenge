import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { GetTransactionRequestDto } from './dtos/get-transaction-request.dto';
import { CreateTransactionRequestDto } from './dtos/create-transaction-request.dto';
import { TransactionAdapter } from 'src/infrastructure/adapters/transaction.adapter';
import { TransactionService } from 'src/application/services/transaction.service';
import { CreateTransactionResponseDto } from 'src/application/dtos/create-transaction-response.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetTransactionEventDto } from './dtos/get-transaction-event.dto';

@Controller('transaction')
@ApiTags('Transaction')
export class TransactionController {
    
    constructor(
        private readonly transactionService: TransactionService
    ){}
    
    @Post()
    async createTransaction(@Body() body: CreateTransactionRequestDto){
        console.log({body});
        const {
            accountExternalIdDebit,
            accountExternalIdCredit,
            transferTypeId,
            value,
          } = body;

        return this.transactionService.createTransaction({
            accountExternalIdDebit,
            accountExternalIdCredit,
            transferTypeId,
            value,
        });
    }
    
    @MessagePattern('transaction-updated')
    async handleEventUpdateTransaction(@Payload() transactionEvent: GetTransactionEventDto) {
        console.log("retrieve:", transactionEvent);
        const { transactionExternalId, status } = transactionEvent;
        await this.transactionService.updateTransaction(transactionExternalId, status);
    }
    
    @Get('/:transactionExternalId')
    @ApiParam(
        {
        name: 'transactionExternalId',
        required: true,
        type: String,
        description: 'Transaction external id',
        example: '34ad9b9e-e5f0-11ed-a05b-0242ac120003'
        }
    )
    async getTransactionById(@Param() params: GetTransactionRequestDto) {
        console.log({params});
        return await this.transactionService.getTransactionById(params.transactionExternalId);
    }
    
}
