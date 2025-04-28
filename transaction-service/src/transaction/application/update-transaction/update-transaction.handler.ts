import { ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { UpdateTransactionCommand } from "./update-transaction.command";
import { PrismaService } from "src/prisma/prisma.service";
import { Logger } from "@nestjs/common";

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  private readonly logger = new Logger(UpdateTransactionHandler.name);
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: UpdateTransactionCommand) {
    const { transactionId, transactionStatus } = command;
    const transaction = await this.prismaService.transaction.update({
      where: { id: transactionId },
      data: { status: transactionStatus },
    });

    this.logger.log(`Updated Transaction: ${JSON.stringify(transactionId)}`);

    return transaction;
  }
}
