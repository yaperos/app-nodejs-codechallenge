import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'yapechallenge',
    synchronize: false,
    logging: false,
    entities: ['dist/**/*.entity{.ts,.js}'],
    retryDelay: 3000,
    retryAttempts: 10,
    schema: 'accounts'
};