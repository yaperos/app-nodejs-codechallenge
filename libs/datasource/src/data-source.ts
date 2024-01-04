import "reflect-metadata"
import "dotenv/config"
import { DataSource } from "typeorm"
import { Transaction } from "./entity/Transaction"

export const TxnDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "p0stgr3s",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [Transaction],
    migrations: [],
    subscribers: [],
})
