import { DataSource } from "typeorm";
import { Transaction } from "./modules/transaction/entity/Transaction";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "123456",
  database: "db_yape",
  synchronize: true,
  // logging: true,
  entities: [Transaction],
})