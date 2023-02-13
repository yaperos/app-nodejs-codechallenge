import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
    Transaction,
    TransactionStatus,
    TransactionType,
} from '../db';
export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        Transaction, 
        TransactionStatus, 
        TransactionType,
    ],
    synchronize: true,
    autoLoadEntities: true,
};