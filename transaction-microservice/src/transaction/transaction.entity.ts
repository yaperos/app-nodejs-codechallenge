import {ObjectType, Field, Int} from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn , Entity, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {TranferType } from 'src/tranfer-type/entities/tranfer-type.entity';
import {TransactionStatus } from 'src/transaction-status/entities/transaction-status.entity'

@Entity()
@ObjectType()
export class Transaction{
    @PrimaryGeneratedColumn()
    @Field((type)=>Int)
    id:number;

    @Column()
    @Field()
    accountExternalIdDebit: string;

    @Column()
    @Field()
    accountExternalIdCredit: string;

    @Column()
    @Field((type)=>Int)
    value:number;

    @Column()
    @Field(()=>Int)
    tranferTypeId: number

    @Column()
    @Field(()=>Int)
    transactionStatusId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(()=>TranferType, (tranferType)=>tranferType.transactions)
    @Field(()=>TranferType)
    tranferType: TranferType

    @ManyToOne(()=>TransactionStatus, (transactionStatus)=>transactionStatus.transactions)
    @Field(()=>TransactionStatus)
    transactionStatus: TransactionStatus


}
