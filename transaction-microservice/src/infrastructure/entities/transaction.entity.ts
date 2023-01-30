import { type } from "os";
import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { TransactionStatus } from "./transaction-status.entity";
import { TransactionType } from "./transaction-type.entity";

@Entity()
export class Transaction{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:'varchar'})
    externalId: string;

    @Column({ type:'varchar'})
    accountExternalIdDebit: string;

    @Column({ type:'varchar'})
    accountExternalIdCredit: string;

    @OneToOne(() => TransactionType)
    @JoinColumn()
    type: TransactionType

    @Column({ type:'double precision'})
    value: number;

    @OneToOne(() => TransactionStatus)
    @JoinColumn()
    status: TransactionStatus

    @CreateDateColumn({ type: 'date' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'date' })
    updatedAt: Date;
}