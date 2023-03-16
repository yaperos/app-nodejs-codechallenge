import { _logger } from "@infrastructure/utils";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Return a logger info when server is running
 *
 * @name server
 * @param {number} port
 * @return {void}
 * */
export const server = (port: string | number): void =>
  _logger.info(`Server is running on ${port}`);

/**
 * Return a new connection in postgres
 *
 * @name postgres
 * @return {Promise<void>}
 * */
export const postgres = new Pool({
  user: `${process.env.POSTGRES_USERNAME}`,
  host: `${process.env.POSTGRES_HOST}`,
  database: `${process.env.POSTGRES_DATABASE}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  port: Number(process.env.POSTGRES_PORT),
});
