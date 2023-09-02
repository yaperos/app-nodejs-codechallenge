import { DataSource } from "typeorm";
import * as dotenv from 'dotenv'

dotenv.config();
const config = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'postgres',//process.env.DATABASE_NAME,
    entities: [__dirname + './../../**/*.entity{.ts,.js}'],
    synchronize: true,
    schema: process.env.DATABASE_SCHEMA,
    migrationsRun:true,
    migrations: ['database/migrations/**/*{.ts,.js}'],
});

config
.initialize()
.then(()=> {console.log(process.env.DATABASE_USER); console.log('Data Source has been initialized!');})
.catch((err)=>{console.error('Error during Data Source initialization',err);})
.finally(()=> console.log('termino'));
console.log(config);
console.log(__dirname + './../../**/*.entity{.ts,.js}');
export default config;
