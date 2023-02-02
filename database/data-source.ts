import {DataSource, DataSourceOptions} from "typeorm";
import {join} from "path";
import { config } from 'dotenv';
import {Init1675305542690} from "./migrations/1675305542690-Init";
import {InitData1675305542690} from "./migrations/1675305542690-Init-data";

config();
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE || 'yape',
    entities: [join('..', '**', '*.entity.{ts,js}')],
    migrations: [Init1675305542690, InitData1675305542690]
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
