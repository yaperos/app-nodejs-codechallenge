import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import {
    // Transaction,
    // TransactionStatus,
    // TransactionType,
// } from '../db';

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'main',
    entities: [
        
    ],
    synchronize: true,
    autoLoadEntities: true,
};