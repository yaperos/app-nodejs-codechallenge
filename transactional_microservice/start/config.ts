import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DatabaseInterface } from './interfaces/database.interface';

dotenv.config();
export const databaseconfig: DatabaseInterface = {
  srv: process.env.BD_SRV,
  host: process.env.BD_HOST,
  port: parseInt(process.env.BD_PORT) || 27017,
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  dbName: process.env.BD_DATABASE,
  dbAuthSource: process.env.BD_AUTHSOURCE,
};
export default registerAs('config', () => {
  const databaseConfig: DatabaseInterface = {
    srv: process.env.BD_SRV,
    host: process.env.BD_HOST,
    port: parseInt(process.env.BD_PORT) || 27017,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    dbName: process.env.BD_DATABASE,
    dbAuthSource: process.env.BD_AUTHSOURCE,
  };
  return {
    database: databaseConfig,
    apiKey: process.env.API_KEY,
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    expirationTimeAuthToken: process.env.EXPIRATION_TIME_AUTH_TOKEN,
    apiKeyEncrypt: process.env.API_KEY_ENCRYPT,
  };
});
