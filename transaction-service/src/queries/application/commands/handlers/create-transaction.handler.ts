import { ICommandHandler, CommandHandler, EventBus } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { CreateTransactionCommand } from "../impl/create-transaction.command";
import { TransactionDocumentMapper } from "../../mappers/transaction-document.mapper";
import { CreateTransactionUseCase } from "../../create-transaction.usecase";
import { CreateTransactionPort } from "src/queries/infraestructure/ports/in/create-transaction.port";

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
    constructor(
        @Inject(CreateTransactionUseCase) private readonly createTransactionPort: CreateTransactionPort
    ) { }

    async execute(command: CreateTransactionCommand) {
        let transaction = TransactionDocumentMapper.commandToDomain(command);  
        return await this.createTransactionPort.createTransaction(transaction);  
    }
}