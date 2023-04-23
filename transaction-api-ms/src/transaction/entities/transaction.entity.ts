import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    accountExternalIdDebit: string

    @Column()
    accountExternalIdCredit: string

    @Column()
    transferTypeId: number

    @Column()
    value: number

    @Column()
    transactionExternalId: string

    @Column()
    transactionStatus: string

    @Column({name: 'created_at', type: 'timestamp'})
    createdAt: Date
}