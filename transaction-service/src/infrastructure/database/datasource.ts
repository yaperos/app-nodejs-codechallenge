import "reflect-metadata"
import { DataSource } from "typeorm"
import { TransactionEntity } from "./entities/transaction.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "yape",
    synchronize: true,
    logging: true,
    entities: [TransactionEntity],
    subscribers: [],
    migrations: ['src/infrastructure/database/migrations/*.ts'],
})