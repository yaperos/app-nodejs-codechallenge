import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Transactionstatus } from "src/transactionstatus/entities/transactionstatus.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Transfertype } from "../../transfertypes/entities/transfertype.entity";
@ObjectType()
@Entity()
export class Transaction {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    accountExternalIdDebit: string;

    @Field()
    @Column()
    accountExternalIdCredit: string;

    @Field( type => Int )
    @Column()
    value: number;

    @Field()
    @Column()
    transactionTypeId: number;

    @Field(() => Transfertype)
    @ManyToOne(() => Transfertype, (transfertype) => transfertype.transactions)
    transactionType: Transfertype;

    @Field()
    @Column()
    transactionStatusId: number;

    @Field(() => Transactionstatus)
    @ManyToOne(() => Transactionstatus, (transaction_status) => transaction_status.transactions)
    transactionStatus: Transactionstatus;

    @Field()
    @Column()
    createdAt: Date
}