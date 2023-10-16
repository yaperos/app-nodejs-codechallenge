import { transactionConfig } from '../../ormconfig.js';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = transactionConfig(true);
export = config;
