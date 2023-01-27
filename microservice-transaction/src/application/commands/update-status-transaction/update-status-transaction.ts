import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTransactionResponse } from "src/application/dtos/update-transaction-reponse.dto";
import { TransactionRepository } from "src/domain/repositories/transaction.repository";
import { TransactionInfrastructure } from "../../../../src/infrastructure/transaction.infrastructure";

export class UpdateTransactionUseCase implements ICommand{
    constructor(
        public readonly transactionExternalId: string,
        public readonly status: string,
    ) {}
}

@CommandHandler(UpdateTransactionUseCase)
export class UpdateTransactionHandler implements ICommandHandler<UpdateTransactionUseCase,UpdateTransactionResponse> {
    constructor (@Inject(TransactionInfrastructure) private transactionRepository: TransactionRepository){}
    async execute(command: UpdateTransactionUseCase): Promise<UpdateTransactionResponse> {
        const {
            transactionExternalId,
            status,
        } = command;

        const transaction = await this.transactionRepository.getTransactionById(transactionExternalId);
        transaction.setStatus(status);
        await this.transactionRepository.saveTransaction(transaction);
        return {
            message: 'Transaction updated successfully',
        }
    }
}