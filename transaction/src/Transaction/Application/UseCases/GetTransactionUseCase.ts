import {TransactionResponseDto} from "../../Domain/Dtos/TransactionResponseDto";
import {TransactionNotFoundException} from "../../Domain/Exceptions/TransactionNotFoundException";
import {TransactionRepositoryInterface} from "../../Domain/Repositories/TransactionRepositoryInterface";
import {Inject} from "@nestjs/common";

export class GetTransactionUseCase {
    constructor(
        @Inject('TransactionRepositoryInterface')
        private transactionRepository: TransactionRepositoryInterface
    ) {}

    async execute(transactionExternalId: string): Promise<TransactionResponseDto> {
        const transaction = await this.transactionRepository.findById(transactionExternalId);

        if (!transaction) {
            throw new TransactionNotFoundException(transactionExternalId);
        }

        return {
            transactionExternalId: transaction.id,
            transactionType: {
                name: transaction.transferTypeName,
            },
            transactionStatus: {
                name: transaction.status,
            },
            value: transaction.value,
            createdAt: transaction.createdAt,
        };
    }
}
