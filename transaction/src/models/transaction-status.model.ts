import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./transaction.model";

@ObjectType({description: 'TransactionStatus'})
@Entity('TransactionStatus')
export class TransactionStatus {    
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field({nullable: false})
    @Column({type: "varchar", length: 100, nullable: false})
    name: string;

    @Field({nullable: false})
    @Column({type: "smallint", nullable: false})
    code: number;

    @Field({defaultValue: true})
    @Column({type: "boolean", default: true})
    isActive: boolean;

    /* Relaciones */    
    @Field(() => [Transaction])
    @OneToMany(() => Transaction, transaction => transaction.transactionStatus)
    transactions: Transaction[];
    /* Fin Relaciones */
}