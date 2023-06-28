import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "transactions"})
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    transactionExternalId: string;

    @Column('text')
    accountExternalIdDebit: string;

    @Column('text')
    accountExternalIdCredit: string;

    @Column('int')
    tranferTypeId: number;

    @Column('text')
    transactionStatus: string;

    @Column('float')
    value: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
