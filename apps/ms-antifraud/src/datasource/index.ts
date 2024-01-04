import "reflect-metadata"
import "dotenv/config"
import { DataSource } from "typeorm"
import { Transaction } from "@common-txn/datasource"

const dsPort = parseInt(process.env.DS_PORT || "5432")

export const txnDataSource = new DataSource({
  type: "postgres",
  host: process.env.DS_HOST,
  port: dsPort,
  username: process.env.DS_USERNAME,
  password: process.env.DS_PASSWORD,
  database: process.env.DS_DATABASE,
  synchronize: true,
  logging: false,
  migrationsRun: false,
  entities: [Transaction],
  subscribers: [],
})
