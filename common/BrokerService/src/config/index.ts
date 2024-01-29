import dotenv from "dotenv";
import fs from "fs";

import { IServicesURL } from "./interfaces";

const DEFAULT_ENV_FILE = `.env`;
const ENVIRONMENT = process.env.NODE_ENV || "development";
const ENV_FILE = `.env.${ENVIRONMENT}`;

dotenv.config({ path: DEFAULT_ENV_FILE });
if (fs.existsSync(ENV_FILE)) {
  dotenv.config({ path: ENV_FILE });
}

const config: IServicesURL = {
  TransactionService:
    process.env.MS_TRANSACTION_QUERY || "http://localhost:3030",
};

const requiredConfig: (keyof IServicesURL)[] = ["TransactionService"];

requiredConfig.forEach((key) => {
  if (!config[key]) {
    throw new Error(`Missing required configuration: ${key}`);
  }
});

export const ConfigEnv = config;
