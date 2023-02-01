import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity("transaction_status")
export class TransactionStatus{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:'varchar'})
    description: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true})
    updatedAt: Date;

    @OneToMany(()=> Transaction, (transaction)=> transaction.status)
    transactions: Transaction[]
}