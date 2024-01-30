import { Controller } from '@nestjs/common';

import { TransactionService } from './transaction.service';

@Controller()
export class AppController {
    constructor(private readonly transactionService: TransactionService) {
    }
}