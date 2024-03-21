import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.model";

@ObjectType({description: 'TransactionType'})
@Entity('TransactionType')
export class TransactionType {    
    @Field(() => ID)
    @PrimaryGeneratedColumn('identity')
    id: number;

    @Field({nullable: false})
    @Column({type: "varchar", length: 100, nullable: false})
    name: string;


    @Field({defaultValue: true})
    @Column({type: "boolean", default: true})
    isActive: boolean;

    /* Relaciones */    
    @Field(() => [Transaction])
    @OneToMany(type => Transaction, transaction => transaction.transactionType)
    transactions: Transaction[];
    /* Fin Relaciones */
}