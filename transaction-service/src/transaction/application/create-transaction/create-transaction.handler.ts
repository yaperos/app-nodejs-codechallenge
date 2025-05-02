import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { CreateTransactionCommand } from "./create-transaction.command";
import { PrismaService } from "src/prisma/prisma.service";
import { Logger } from "@nestjs/common";

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  private readonly logger = new Logger(CreateTransactionHandler.name);
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: CreateTransactionCommand) {
    const { createTransactionDTO } = command;
    const transaction = await this.prismaService.transaction.create({
      data: {
        accountExternalIdDebit: createTransactionDTO.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDTO.accountExternalIdCredit,
        transactionTypeId: createTransactionDTO.transactionTypeId,
        value: createTransactionDTO.value,
      },
    });

    this.logger.log(`New Transaction Id: ${transaction.id}`);
    return transaction;
  }
}
