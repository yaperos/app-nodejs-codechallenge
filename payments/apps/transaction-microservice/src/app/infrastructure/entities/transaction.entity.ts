import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, AfterInsert, ManyToOne } from "typeorm";
import { TransactionStatus } from "./transaction-status.entity";
import { TransactionType } from "./transaction-type.entity";

@Entity('transaction')
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:'varchar', unique: true})
    externalId: string;

    @Column({ type:'varchar'})
    accountExternalIdDebit: string;

    @Column({ type:'varchar'})
    accountExternalIdCredit: string;

    @ManyToOne(() => TransactionType, (transactionType)=> transactionType.transactions)
    @JoinColumn()
    type: TransactionType

    @Column({ type:'double precision'})
    value: number;

    @ManyToOne(() => TransactionStatus, (transactionStatus)=> transactionStatus.transactions)
    @JoinColumn()
    status: TransactionStatus

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true})
    updatedAt: Date;

}