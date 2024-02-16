import { Injectable } from "@nestjs/common";
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
        accountExternalIdCredit,
        accountExternalIdDebit,
        statusTransaction,
        transferTypeId,
        id,
        ...restData
      }) => ({
        transactionExternalId:
          accountExternalIdCredit || accountExternalIdDebit,
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
    new CreateTransactionDto(accountExternalIdDebit, accountExternalIdCredit);

    const transaction = this.transactionRepository.create({
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId: accountExternalIdDebit ? 1 : 0,
      ...restData,
    });
    return this.transactionRepository.save(transaction);
  };
}
