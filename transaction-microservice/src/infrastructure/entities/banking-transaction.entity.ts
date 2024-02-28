import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { TransferType } from "./transfer-type.entity";

@Entity({name: 'BankingTransactions'})
@ObjectType()
export class BankingTransaction {

    @Field(() => ID)
    @PrimaryColumn({type:'uuid'})
    transactionExternalId: string

    @Column({type:'uuid'})
    @Field(() => ID)
    accountExternalIdDebit: string;

    @Column({type:'uuid'})
    @Field(() => ID)
    accountExternalIdCredit: string;

    @ManyToOne(() => TransferType, transferType => transferType.bankingTransactions)
    @Field(() => TransferType, {name:'transferType'})
    transferType: TransferType;

    @Column({type:'decimal'})
    @Field(() => Float) // Esta línea indica que 'value' es un número de punto flotante
    value: number;

    /*Usuario no envia*/
    //@Field(() => Date)
    @CreateDateColumn({type: 'date'})
    createdAt: Date;

    
    @Column({ type: 'jsonb' })
    transactionStatus: Record<string, any>; 
}