import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { 
    TransactionStatusModel, 
    TransactionTypeModel, 
    TransactionModel,
} from "../models"

dotenv.config();
const { POSTGRES_USER, DATABASE_HOST, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSTGRES_PORT } = process.env


const sequelize = new Sequelize(
    `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}`,
    { 
        logging: false,
        models: [TransactionStatusModel, TransactionTypeModel, TransactionModel]
    }
    );


export default sequelize;