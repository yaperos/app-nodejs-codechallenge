import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("transaction_type")
export class TransactionType{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:'varchar'})
    description: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true})
    updatedAt: Date;
}