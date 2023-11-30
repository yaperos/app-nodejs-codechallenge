import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TransactionStatus, TransferType } from './catalogs.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'account_external_id_debit' })
    accountExternalIdDebit: string;

    @Column({ name: 'account_external_id_credit' })
    accountExternalIdCredit: string;

    @Column({ name: 'transfer_type_id' })
    transferTypeId: number;

    @Column({ name: 'transaction_value', type: 'decimal' })
    transactionValue: number;

    @Column({ name: 'transaction_status_id' })
    transactionStatusId: number;

    @CreateDateColumn({ name: 'created_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @OneToOne(() => TransferType)
    @JoinColumn({ name: 'transfer_type_id' })
    transferType: TransferType


    @OneToOne(() => TransactionStatus)
    @JoinColumn({ name: 'transaction_status_id' })
    transactionStatus: TransactionStatus
}
