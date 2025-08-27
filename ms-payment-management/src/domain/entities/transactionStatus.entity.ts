import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Payment } from './payment.entity';

@Entity('transaction_statuses')
export class TransactionStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => Payment, { nullable: false })
    @JoinColumn({ name: 'payment_id' })
    payment: Payment;

    @CreateDateColumn()
    created_at: Date;
}
