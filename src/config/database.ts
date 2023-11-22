import { DataSource } from "typeorm";
import { Transaction } from "../models/transaction";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres", //localhost
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  entities: [Transaction],
  synchronize: true,
});

export const connectDatabase = async (): Promise<DataSource> => {
  await AppDataSource.initialize();
  return AppDataSource;
};
