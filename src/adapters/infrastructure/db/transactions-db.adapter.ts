import { DataSource } from "typeorm";
import { config as dotEnvConfig } from "dotenv";
import { TransactionEntity, TransactionStatusEntity, TransferTypeEntity } from "../../../modules/transaction/infrastructure/persistence/typeorm/entities";
dotEnvConfig();

export const TransactionsDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5434,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
    logging: true,
    entities: [TransactionEntity, TransactionStatusEntity, TransferTypeEntity]
});