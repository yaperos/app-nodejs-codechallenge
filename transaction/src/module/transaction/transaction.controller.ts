import { Body, Controller, Post } from '@nestjs/common';
import { TransactionRequest } from './dto/transaction-request.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

    constructor(
        private readonly service: TransactionService
    ) { }

    @Post()
    processTransaction(@Body() request: TransactionRequest) {
        return this.service.initProcessTransaction(request);
    }
}
