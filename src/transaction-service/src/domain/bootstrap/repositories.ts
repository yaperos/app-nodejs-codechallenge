import { config } from "dotenv";
import { Pool } from "pg";
import { TransactionRepository } from "../repositories/ports";
import { PostgresTransactionRepository } from "../repositories/postgres/transaction-repository";

config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const transactionRepository: TransactionRepository =
  new PostgresTransactionRepository(pool);

export { transactionRepository };
