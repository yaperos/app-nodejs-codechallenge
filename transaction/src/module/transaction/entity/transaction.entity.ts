import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionStatus } from "./transaction_status.entity";
import { TransactionTypes } from "./transaction_types.entity";

@Entity('transactions')
export class Transaction {

    @PrimaryGeneratedColumn("uuid", { name: 'id' })
    transactionExternalId?: string;

    @Column({ name: 'accountexternaliddebit', type: 'varchar', length: 100, nullable: false })
    accountExternalIdDebit?: string;

    @Column({ name: 'accountexternalidcredit', type: 'varchar', length: 100, nullable: false })
    accountExternalIdCredit?: string;

    @Column({ name: 'transactiontypeid', type: 'bigint', nullable: false })
    transactionTypeId?: BigInt;

    @Column({ name: 'transactionstatusid', type: 'bigint', nullable: false })
    transactionStatusId?: BigInt;

    @Column({ nullable: false })
    value?: number;

    @Column({ type: 'varchar', length: 1, nullable: false })
    active?: string;

    @Column({ name: 'createdby', type: 'varchar', length: 30, nullable: false })
    createdBy?: string;

    @CreateDateColumn({ name: 'createdat', nullable: false })
    createdAt?: Date;

    @Column({ name: 'updatedby', type: 'varchar', length: 30, nullable: true })
    updatedBy?: string;

    @CreateDateColumn({ name: 'updatedat', nullable: true })
    updatedAt?: Date;

    @ManyToOne(() => TransactionTypes, type => type.id, { eager: true })
    @JoinColumn({ name: 'transactiontypeid', referencedColumnName: 'id', foreignKeyConstraintName: 'transactiontypeid' })
    transactionType?: TransactionTypes;

    @ManyToOne(() => TransactionStatus, status => status.id)
    @JoinColumn({ name: 'transactionstatusid', referencedColumnName: 'id', foreignKeyConstraintName: 'transactionstatusid' })
    transactionStatus?: TransactionStatus;

}