
import { Body, Controller, Post, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { CreateTransactionRequestDto } from 'src/application/adapters/transaction/create-transaction.request.dto';
import { TransactionService } from 'src/application/services/transaction/transaction.service';

@Controller('api/transaction')
export class TransactionController implements OnModuleInit {

    constructor(
        @Inject(TransactionService)
        private readonly transactionService: TransactionService,
        @Inject('TRANSACTIONAL_EVENTS_SERVICE') 
        private readonly transactionalES: ClientKafka
    ){}

    @Post()
    async createTransaction(@Body() body: CreateTransactionRequestDto): Promise<boolean>{
        await this.transactionService.createTransaction(body);
        return true;
    }

    onModuleInit() {
        this.transactionalES.subscribeToResponseOf('create-transaction');
    }
    
}
