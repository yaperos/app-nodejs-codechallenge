import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TRANSACTION_TABLE_NAME } from "../commons/constants-database";

@Entity({ name: TRANSACTION_TABLE_NAME })
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    transactionExternalId: string;

    @Column({ name: 'account_external_id_debit' })
    accountExternalIdDebit: string;

    @Column({ name: 'account_external_id_credit' })
    accountExternalIdCredit: string;

    @Column({ name: 'transfer_type' })
    tranferType: number;

    @Column({ name: 'status' })
    status: string;

    @Column({ name: 'value' })

    value: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}