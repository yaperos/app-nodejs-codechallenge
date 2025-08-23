
import {Inject, Injectable} from "@nestjs/common";
import {TransactionRepositoryInterface} from "../../Domain/Repositories/TransactionRepositoryInterface";
import {TransactionEventInterface} from "../../Domain/Events/TransactionEventInterface";
import {TransactionResponseDto} from "../../Domain/Dtos/TransactionResponseDto";
import {CreateTransactionDto} from "../../Domain/Dtos/CreateTransactionDto";

@Injectable()
export class CreateTransactionUseCase {
    constructor(
        @Inject('TransactionRepositoryInterface')
        private readonly transactionRepository: TransactionRepositoryInterface,
        @Inject('TransactionEventInterface')
        private readonly eventPublisher: TransactionEventInterface,
    ) {}

    async execute(transactionData: CreateTransactionDto): Promise<TransactionResponseDto> {
        const transaction = await this.transactionRepository.create(transactionData);

        await this.eventPublisher.publishTransactionCreated(transaction);

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
