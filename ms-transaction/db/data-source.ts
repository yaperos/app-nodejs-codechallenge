import {DataSource, DataSourceOptions} from "typeorm" 

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'challenge_db',
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/db/migrations/*{.ts,.js}"],
    migrationsTableName: 'migrations',
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

