import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TransactionModel } from '../../domain/transaction.model';
import { TransactionRepository } from '../../domain/transaction.repository';
import { CreateTransactionCommand } from "../create-transaction.command";

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {

  constructor(
    @Inject(TransactionRepository) private readonly transactionRepository: TransactionRepository) { }

  async execute(command: CreateTransactionCommand): Promise<TransactionModel> {
    return await this.transactionRepository.save(command.createTransactionInput);
  }
}