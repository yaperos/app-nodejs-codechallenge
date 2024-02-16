import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["apps/**/src/**/entities/*.entity{.ts,.js}"],
  synchronize: process.env.DB_SYNCHRONIZE === "true" || true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
