import dotenv from "dotenv";

dotenv.config();

export const TOPIC_NAME = process.env.TOPIC_NAME;
export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
export const KAFKA_HOST = process.env.KAFKA_HOST;

export const dbConfig = {
  host: process.env.PG_HOST ?? "localhost",
  database: process.env.PG_DB ?? "postgres",
  user: process.env.PG_USER ?? "postgres",
  password: process.env.PG_PWD ?? "postgres",
  port: parseInt(process.env.PG_PORT ?? "5432"),
};
