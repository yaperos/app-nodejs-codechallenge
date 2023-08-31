import * as dotenv from "dotenv";

dotenv.config();

import DEV from "./enviroment/dev";

const { NODE_ENV } = process.env;

export type Configuration = {
  NODE_ENV: string;
  PORT: number;
  APP_LOG_LEVEL: string;
};

let currentConfig: Configuration = DEV;

switch (NODE_ENV) {
  default:
    currentConfig = DEV;
}

export { currentConfig as config };
