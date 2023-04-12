import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices/decorators';

import { ValidationService } from './validation.service';

@Controller('validation')
export class ValidationController {
    constructor(
        private readonly validationService: ValidationService
    ) { }

    @EventPattern('transaction.created')
    async handleTransactionCreated(data: any) {
        Logger.log(`CREATED TRANSACTION [ID: ${JSON.stringify(data.transactionExternalId)}, VALUE:${JSON.stringify(data.value)}]`);

        this.validationService.validateTransaction(data.transactionExternalId, data.value);
    }
}
