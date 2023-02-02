import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { TransactionStatus } from "../../app/infrastructure/entities/transaction-status.entity";

export default class TransactionStatusSeeder extends Seeder{
    async run(dataSource: DataSource): Promise<void> {
        let pending = new TransactionStatus();
        pending.description = 'pending';
        pending.createdAt = new Date();
        let approved = new TransactionStatus();
        approved.description = 'approved';
        approved.createdAt = new Date();
        let rejected = new TransactionStatus();
        rejected.description = 'rejected';
        rejected.createdAt = new Date();
        let types: TransactionStatus[] = [ pending, approved, rejected ];
        await dataSource.createEntityManager().save<TransactionStatus>(types);
    }
    
}