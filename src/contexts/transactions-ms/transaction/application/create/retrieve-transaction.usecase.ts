import { Inject, Injectable } from '@nestjs/common';

import { TransactionModel } from '../../domain/transaction.model';
import { TransactionRepository } from '../../domain/transaction.repository';
import { TransactionResponseDto } from '../../infraestructure/dtos/transaction-response.dto';

@Injectable()
export class RetrieveTransactionUsecase {
    constructor(
        @Inject(TransactionRepository)
        private readonly transactionRepository: TransactionRepository,
    ) {}

    public async getTransactionData(
        id: string,
    ): Promise<TransactionResponseDto> {
        const transaction = await this.transactionRepository.getById(id);

        return this.mappingToTransactionResponse(transaction);
    }

    private mappingToTransactionResponse(
        transaction: TransactionModel,
    ): TransactionResponseDto {
        return {
            transactionExternalId: transaction.id,
            transactionType: {
                name: transaction.transactionTypeName,
            },
            transactionStatus: {
                name: transaction.status,
            },
            value: transaction.value,
            createdAt: transaction.createdAt,
        };
    }
}
