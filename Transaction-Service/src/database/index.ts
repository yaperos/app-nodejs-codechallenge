import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const { POSTGRES_USER, DATABASE_HOST, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSTGRES_PORT } = process.env

const sequelize = new Sequelize(
    `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}`
    );

export default sequelize;