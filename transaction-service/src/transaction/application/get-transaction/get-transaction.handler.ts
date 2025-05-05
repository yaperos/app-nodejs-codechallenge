import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransactionQuery } from "./get-transaction.query";
import { PrismaService } from "src/prisma/prisma.service";
import { Logger } from "@nestjs/common";

const TRANSACTION_TYPE_MAP: Record<number, string> = {
  1: "DEPOSIT",
  2: "TRANSFER",
  3: "SERVICE",
};

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler
  implements IQueryHandler<GetTransactionQuery>
{
  private readonly logger = new Logger(GetTransactionHandler.name);
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: GetTransactionQuery) {
    const { getTransactionDTO } = command;
    const transaction = await this.prismaService.transaction.findFirst({
      where: { id: getTransactionDTO.transactionExternalId },
    });

    if (!transaction) {
      return null;
    }

    const response = {
      transactionExternalId: transaction.id,
      transactionType: {
        name: TRANSACTION_TYPE_MAP[transaction.transactionTypeId] || "Unknown",
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value.toString(),
    };

    return response;
  }
}
