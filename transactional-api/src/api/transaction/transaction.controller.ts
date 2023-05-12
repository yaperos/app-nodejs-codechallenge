
import { Body, Controller, Post, Get, OnModuleInit, Inject, Param } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequestDto } from 'src/application/adapters/transaction/create-transaction.request.dto';
import { GetTransactionRequestDto } from 'src/application/adapters/transaction/get-transaction.request.dto';
import { TransactionQuery } from 'src/application/queries/transaction/transaction.query';
import { TransactionService } from 'src/application/services/transaction/transaction.service';

@Controller('api/transaction')
export class TransactionController implements OnModuleInit {

    constructor(
        @Inject(TransactionService)
        private readonly transactionService: TransactionService,
        @Inject(TransactionQuery)
        private readonly transactionQuery: TransactionQuery,
        @Inject('TRANSACTIONAL_EVENTS_SERVICE') 
        private readonly transactionalES: ClientKafka
    ){}

    @Get('/:transactionExternalId')
    async getTransaction(@Param() params: GetTransactionRequestDto){
        return this.transactionQuery.getTransaction(params);
    }

    @Post()
    async createTransaction(@Body() body: CreateTransactionRequestDto): Promise<boolean>{
        await this.transactionService.createTransaction(body);
        return true;
    }

    onModuleInit() {
        this.transactionalES.subscribeToResponseOf('create-transaction');
    } 
}
