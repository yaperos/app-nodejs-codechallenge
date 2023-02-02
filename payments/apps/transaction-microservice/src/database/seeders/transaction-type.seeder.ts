import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { TransactionType } from "../../app/infrastructure/entities/transaction-type.entity";

export default class TransactionTypeSeeder extends Seeder{
    async run(dataSource: DataSource): Promise<void> {
        let sameBank = new TransactionType();
        sameBank.description = 'Same bank transfers';
        let localInterbank = new TransactionType();
        localInterbank.description = 'Local interbank transfers';
        let foreignInterbank = new TransactionType();
        foreignInterbank.description = 'Foreign interbank transfers';

        const types: TransactionType[] = [ sameBank, localInterbank, foreignInterbank ];

        await dataSource.createEntityManager().save<TransactionType>(types);
    }
    
}