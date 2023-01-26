import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CreateTransactionResponse } from "src/application/dtos/create-transaction-response.dto";

export class CreateTransactionUseCase implements ICommand{
    constructor(
        public readonly transactionExternalId: string,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly tranferType: number,
        public readonly value: number,
    ) {}
}

@CommandHandler(CreateTransactionUseCase)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionUseCase,CreateTransactionResponse> {
    execute(command: CreateTransactionUseCase): Promise<CreateTransactionResponse> {
        throw new Error("Method not implemented.");
    }
}