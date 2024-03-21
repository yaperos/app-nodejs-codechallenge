import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TRANSACTION_VALIDATED } from '../../constants';
import { TransactionsService } from '../services/transactions.service';
import { UpdateTransaction } from '../../types';

@Controller('transactions')
export class TransactionsController {

    constructor(
        private readonly transactionsService: TransactionsService
    ) { }

    @EventPattern(TRANSACTION_VALIDATED)
    async updateTransaction(@Payload() transaction: UpdateTransaction): Promise<void> {  
        await this.transactionsService.updateTransaction(transaction)
    }
}
