import {Inject, Injectable} from "@nestjs/common";
import {TransactionRepositoryInterface} from "../../Domain/Repositories/TransactionRepositoryInterface";
import {Transaction} from "../../Domain/Entities/Transaction";
import {TransactionStatus} from "@prisma/client";

@Injectable()
export class UpdateTransactionStatusUseCase {
    constructor(
        @Inject('TransactionRepositoryInterface')
        private readonly transactionRepository: TransactionRepositoryInterface
    ) {}

    async execute(transactionExternalId: string, status: string): Promise<Transaction> {
        return this.transactionRepository.updateStatus(transactionExternalId, status);
    }
}
