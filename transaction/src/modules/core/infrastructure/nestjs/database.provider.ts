import { TransactionEntity } from "../../../../modules/transaction/infrastructure/entities/transaction.entity";
import { AppService } from "../../../../app.service";
import { DataSource } from "typeorm";
import { TransactionDoc } from "../../../../modules/transaction/infrastructure/entities/transaction-doc.entity";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE_MYSQL',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: AppService.database_host,
                port: AppService.database_port,
                username: AppService.database_user,
                password: AppService.database_pass,
                database: AppService.database_name,
                entities: [TransactionEntity],
                synchronize: true,
                logging: false,
            });

            return dataSource.initialize();
        },
    },
    {
        provide: 'DATA_SOURCE_MONGO',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mongodb',
                url: `mongodb://${AppService.mongo_user}:${AppService.mongo_pass}@${AppService.mongo_host}/${AppService.mongo_name}?retryWrites=true&w=majority&authSource=admin`,
                synchronize: true,
                logging: false,
                entities: [TransactionDoc],
                migrations: [],
                subscribers: [],
            });

            return dataSource.initialize();
        },
    },
];