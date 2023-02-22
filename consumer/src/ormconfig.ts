import { DataSource } from "typeorm";

  
  
  export const connectionSource = new DataSource({
    migrationsTableName: 'Task',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'yape',
    logging: false,
    synchronize: true,
    name: 'default',
    entities: ['src/**.entity{.ts,.js}'],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    subscribers: ['src/subscriber/**/*{.ts,.js}'],
});