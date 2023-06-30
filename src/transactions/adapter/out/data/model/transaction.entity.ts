import { Entity, PrimaryColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class TransactionEntity {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'account_external_id_debit', type: 'varchar', length: 36 })
    accountExternalIdDebit: string;

    @Column({ name: 'account_external_id_credit', type: 'varchar', length: 36 })
    accountExternalIdCredit: string;

    @Column({ name: 'transaction_type', type: 'varchar' })
    transactionType: string;

    @Column({ name: 'transaction_status', type: 'varchar' })
    transactionStatus: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    amount: number;

    @CreateDateColumn({ name: 'create_at', type: 'timestamp' })
    createAt: Date = new Date();

    @UpdateDateColumn({ name: 'update_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP(6)', nullable: true })
    updateAt: Date;
}
