import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres_db',
    synchronize: true,
    logging: true,
    "migrations": [
         "migrations/**/*.ts"
    ],
  });
  
  export default AppDataSource;