import { config } from '.';
import { Sequelize } from 'sequelize';

const db = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: 'postgres',
    logging: false
});

export const dbConnect = async () => {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('DATABASE ERROR:', error);
    }
}

export default db;