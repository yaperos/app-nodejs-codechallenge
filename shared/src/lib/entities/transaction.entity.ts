
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Transaction {
    @ObjectIdColumn()
    transactionExternalId?: string;

    @Column()
    transactionType: string;

    @Column()
    transactionStatus: string;

    @Column()
    value: number;

    @CreateDateColumn()
    createdAt: Date;
}