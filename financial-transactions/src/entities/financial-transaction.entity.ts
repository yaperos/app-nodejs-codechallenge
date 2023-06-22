/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('financial_transaction')
export class FinancialTransaction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid', name: 'transaction_external_id' })
    transactionExternalId: string;

    @Column({ type: 'uuid', name: 'account_external_id_debit' })
    accountExternalIdDebit: string;

    @Column({ type: 'uuid', name: 'account_external_id_credit' })
    accountExternalIdCredit: string;

    @Column({ name: 'tranfer_type_id' })
    tranferTypeId: number;

    @Column({ name: 'value', type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ name: 'transaction_status' })
    transactionStatus: string;

    @Column({ name: 'created_at' })
    createdAt: Date;

}