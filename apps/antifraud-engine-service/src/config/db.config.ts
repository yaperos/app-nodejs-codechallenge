import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
    AntifraudFeature,
} from '../db';

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [AntifraudFeature],
    synchronize: true,
    autoLoadEntities: true,
};