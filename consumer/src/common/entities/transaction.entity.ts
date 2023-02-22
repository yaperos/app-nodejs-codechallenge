import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('transaction')
export class Transaction{
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:100})
    transactionExternalId: string;

    @Column()
    transactionType: number;

    @Column()
    transactionStatus: number;

    @Column()
    valueTx: number;

}