import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { TransactionStatus } from "../../app/infrastructure/entities/transaction-status.entity";

export default class TransactionStatusSeeder extends Seeder{
    async run(dataSource: DataSource): Promise<void> {
        let pending = new TransactionStatus();
        pending.description = 'pending';
        let approved = new TransactionStatus();
        approved.description = 'approved';
        let rejected = new TransactionStatus();
        rejected.description = 'rejected';
        let types: TransactionStatus[] = [ pending, approved, rejected ];
        await dataSource.createEntityManager().save<TransactionStatus>(types);
    }
    
}