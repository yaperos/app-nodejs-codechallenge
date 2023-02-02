import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { InitialMigration1675076749078 } from 'apps/transaction-microservice/src/database/migrations/1675076749078-initial-migration';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionType } from '../../entities/transaction-type.entity';
import { TransactionStatus } from '../../entities/transaction-status.entity';


if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: './env/local.env' });
}

const datasource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: [ __dirname + './../../**/*.entity{.ts,.js}'],
    synchronize:false,
    migrationsRun: true,
    migrations: [ 'src/database/migrations/**/*{.ts,.js}' ]
});

console.log("- Iniciando Datasource...")
datasource.initialize()
.then(() => {
    console.log("✔ Data Source has been initialized!")
})
.catch((err) => {
    console.error("✖ Error during Data Source initialization", err)
});

export default datasource; 