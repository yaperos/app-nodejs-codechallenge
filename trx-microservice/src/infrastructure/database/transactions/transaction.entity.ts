import { TRANSACTION_STATUS } from 'src/domain/transactions/transaction';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity('transactions')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid') transactionExternalId: string;
    @Column() accountExternalIdDebit: string;
    @Column() accountExternalIdCredit: string;
    @Column() tranferTypeId: number;
    @Column({ default: TRANSACTION_STATUS.PENDING }) transactionStatus: TRANSACTION_STATUS;
    @Column() value: number;
    @CreateDateColumn() createdAt: Date;
    @UpdateDateColumn() updatedAt: Date;
}