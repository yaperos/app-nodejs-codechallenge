import dotenv from 'dotenv';
dotenv.config();

import pkg from '../package.json';

export interface AppConfig {
  APP_NAME: string;
  KAFKA_HOST: string;
  API_TRANSACTION_URL: string;
}

export const config: AppConfig = {
  APP_NAME: pkg.name,
  KAFKA_HOST: process.env.KAFKA_HOST as string,
  API_TRANSACTION_URL: process.env.API_TRANSACTION_URL as string,
};
