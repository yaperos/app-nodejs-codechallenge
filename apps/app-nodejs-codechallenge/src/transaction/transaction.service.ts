import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Transaction from "./entities/transaction.entity";
import { Repository } from "typeorm";
import CreateTransactionDto from "./dto/create-transaction.dto";
import { StatusEnum } from "./enums/status.enum";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Injectable()
export default class TransactionService {
  private readonly topic: string;
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject("KAFKA_PRODUCER") private readonly kafka: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.topic = this.configService.getOrThrow<string>("KAFKA_TOPIC_CREATED");
  }

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
    await this.transactionRepository.save(transaction);
    this.kafka.emit(this.topic, {
      value: {
        id: transaction.transactionExternalId,
        value: transaction.value,
      },
    });
    return { message: "Transaction registered", ok: true };
  };
}
