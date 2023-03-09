import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Generated("uuid")
    @Column()
    transactionExternalId: string;

    @Column()
    accountExternalIdDebit: string;

    @Column()
    accountExternalIdCredit: string;

    @Column()
    state: string;

    @Column()
    transactionType: string;

    @Column()
    value: number;

    @CreateDateColumn()
    createdAt: Date;
}