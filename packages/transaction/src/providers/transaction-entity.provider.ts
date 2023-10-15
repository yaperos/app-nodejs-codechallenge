import { DataSource } from "typeorm";
import { Transaction } from "../entities/transaction.entity";

export const transactionEntityProviders = [
  {
    provide: "TRANSACTION_REPOSITORY",
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Transaction),
    inject: ["POSTGRES_DATASOURCE"],
  },
];
