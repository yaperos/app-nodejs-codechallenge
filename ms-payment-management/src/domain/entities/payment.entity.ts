import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { TransactionStatus } from './transactionStatus.entity';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';
export type CurrencyType = 'S/.' | 'USD';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid' })
    accountExternalIdDebit: string;

    @Column({ type: 'uuid' })
    accountExternalIdCredit: string;

    @Column('int')
    tranferTypeId: number;

    @Column('decimal', { precision: 18, scale: 2 })
    value: number;

    @OneToMany(() => TransactionStatus, (transactionStatus) => transactionStatus.payment)
    transactionStatuses: TransactionStatus[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}