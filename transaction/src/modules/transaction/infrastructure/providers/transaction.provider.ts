import { TransactionDoc } from "../entities/transaction-doc.entity";
import { TransactionEntity } from "../entities/transaction.entity";

export const transactionProviders = [
    {
        provide: 'TRANSACTION_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(TransactionEntity),
        inject: ['DATA_SOURCE_MYSQL'],
    },
    {
        provide: "TRANSACTION_DOC_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(TransactionDoc),
        inject: ["DATA_SOURCE_MONGO"]
    }
];