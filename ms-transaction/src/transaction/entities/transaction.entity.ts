import { Field, ObjectType } from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { TransactionStatus } from "./transactionStatus.entity";
import { TransactionType } from "./transactionType.entity";

@Entity()
@ObjectType()
export class Transaction {
    
    @PrimaryGeneratedColumn("uuid")
    @Field()
    transactionExternalId: string;

    @Column('uuid')
    @Field()
    accountExternalIdDebit: string;

    @Column('uuid')
    @Field()
    accountExternalIdCredit: string;

    @Column('int')
    @Field()
    tranferTypeId: number;

    @Column('decimal')
    @Field()
    value: number;

    @Column('timestamp')
    @Field()
    createdAt: Date;

    @Column('int', {default: 1})
    @Field()
    transactionTypeId: number;

    @ManyToOne(() => TransactionType)
    @JoinColumn({ name: "transactionTypeId" })
    @Field(() => TransactionType)
    transactionType: TransactionType;

    @Column('int', {default: 1 })
    transactionStatusId: number;

    @ManyToOne(() => TransactionStatus)
    @JoinColumn({ name: "transactionStatusId" })
    @Field(() => TransactionStatus)
    transactionStatus: TransactionStatus;
}






