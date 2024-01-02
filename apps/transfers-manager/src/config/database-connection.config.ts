import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    usernmae: process.env.DB_USER_NAME || 'postgres',
    password: process.env.DB_PWD || 'postgres',
    dbName: process.env.DB_NAME || 'postgres',
    synchronize: process.env.DB_SYNCHRONIZE ? JSON.parse(process.env.DB_SYNCHRONIZE) : true
}));