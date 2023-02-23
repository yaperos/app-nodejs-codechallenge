import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { TransactionStatus } from 'src/contexts/transactions-ms/shared/domain/enums/transaction-status.enum';
import { TransactionRepository } from '../../domain/transaction.repository';
import { ValidationTransactionDto } from '../../infraestructure/dtos/validation-transaction.dto';

@Injectable()
export class UpdateTransactionStatusUsecase {
    constructor(
        @Inject(TransactionRepository)
        private readonly transactionRepository: TransactionRepository,
    ) {}

    @OnEvent('transaction_validation')
    async updateStatusOnValidator(validation: ValidationTransactionDto) {
        const newStatus = validation.isValid
            ? TransactionStatus.APPROVED
            : TransactionStatus.REJECTED;

        await this.transactionRepository.updateStatus(
            validation.transactionId,
            newStatus,
        );
    }
}
