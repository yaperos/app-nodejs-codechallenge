import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Transaction from "./entities/transaction.entity";
import { Repository } from "typeorm";
import CreateTransactionDto from "./dto/create-transaction.dto";
import { StatusEnum } from "./enums/status.enum";

@Injectable()
export default class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  public listTransactions = async () => {
    const transactions = await this.transactionRepository.find();

    return transactions.map(
      ({
        transactionExternalId,
        statusTransaction,
        transferTypeId,
        ...restData
      }) => ({
        transactionExternalId,
        transactionType:
          transferTypeId === 1 ? { name: "Debit" } : { name: "Credit" },
        transactionStatus: {
          name: Object.values(StatusEnum).find(
            (statusTransaction) => statusTransaction,
          ),
        },
        ...restData,
      }),
    );
  };

  public createTransaction = async ({
    accountExternalIdDebit,
    accountExternalIdCredit,
    ...restData
  }: CreateTransactionDto) => {
    if (
      (!accountExternalIdDebit && !accountExternalIdCredit) ||
      (accountExternalIdDebit && accountExternalIdCredit)
    )
      throw new BadRequestException(
        "Exactly one of accountExternalIdDebit or accountExternalIdCredit must be provided, not both.",
      );

    const transaction = this.transactionRepository.create({
      transactionExternalId: accountExternalIdDebit || accountExternalIdCredit,
      transferTypeId: accountExternalIdDebit ? 1 : 2,
      ...restData,
    });
    return this.transactionRepository.save(transaction);
  };
}
