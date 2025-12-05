import { DataSource } from "typeorm";
import { Transaction } from "../entities/Transaction";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: true, // modo dev
  logging: false,
  entities: [Transaction],
  migrations: [],
  subscribers: [],
});
