import { Sequelize } from 'sequelize';
import { POSTGRES_URI } from '../../shared/config';

export const sequelize = new Sequelize(POSTGRES_URI,{
        logging: true,
    }
);