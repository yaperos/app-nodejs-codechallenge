import { Inject } from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { ClientKafka } from "@nestjs/microservices";
import { CreateTransactionResponse } from "../../../../src/application/dtos/create-transaction-response.dto";
import { Transaction } from "../../../../src/domain/aggregates/transaction";
import { TransactionRepository } from "../../../../src/domain/repositories/transaction.repository";
import { TransactionInfrastructure } from "../../../../src/infrastructure/transaction.infrastructure";

export class CreateTransactionUseCase implements ICommand{
    constructor(
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly tranferType: number,
        public readonly value: number,
    ) {}
}

@CommandHandler(CreateTransactionUseCase)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionUseCase,CreateTransactionResponse> {

    constructor(
        @Inject(TransactionInfrastructure) private transactionRepository: TransactionRepository,
        @Inject('TRANSACTION_MICROSERVICE') private readonly transactionEmitter: ClientKafka,
    ) {}

    async execute(command: CreateTransactionUseCase): Promise<CreateTransactionResponse> {
        const {
            accountExternalIdDebit,
            accountExternalIdCredit,
            tranferType,
            value,
        } = command;

        const transaction  = new Transaction({
            accountExternalIdDebit,
            accountExternalIdCredit,
            tranferType,
            value,
        });

        const transactionCreated = await this.transactionRepository.saveTransaction(transaction);
        this.transactionEmitter.emit('transaction.created', JSON.stringify(
            {
                transactionExternalId: transactionCreated.getTransactionExternalId(),
                value   : transactionCreated.getValue(),
            }
        ));
        return {
            transactionExternalId: transactionCreated.getTransactionExternalId(),
            message: 'Transaction created successfully',
        }

    }
}