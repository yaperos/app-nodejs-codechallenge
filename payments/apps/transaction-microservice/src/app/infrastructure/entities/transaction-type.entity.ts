import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity("transaction_type")
export class TransactionType{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:'varchar'})
    description: string;

    @CreateDateColumn({ type: 'timestamp', default: 'LOCALTIMESTAMP'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true})
    updatedAt: Date;

    @OneToMany(()=> Transaction, (transaction)=> transaction.type)
    transactions: Transaction[]
}