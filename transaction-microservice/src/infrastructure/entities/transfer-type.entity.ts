import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BankingTransaction } from "./banking-transaction.entity";

@Entity({ name: 'TransferTypes' })
@ObjectType()
export class TransferType {

    @PrimaryColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar' })
    @Field(() => String)
    name: string;

    @OneToMany(
        type => BankingTransaction,
        bankingTransaction => bankingTransaction.transferType
    )
    bankingTransactions: BankingTransaction[];
}