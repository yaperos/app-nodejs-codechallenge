import * as dotenv from "dotenv";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import TransactionCreatedSubscriber from "../../transaction/subscribers/transaction.created.subscriber";
dotenv.config();

const dataSourceOptions: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true" || true,
  autoLoadEntities: true,
  subscribers: [TransactionCreatedSubscriber],
};

export default dataSourceOptions;
