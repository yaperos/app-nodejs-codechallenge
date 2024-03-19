import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transaction } from './transaction.entity';

@Entity()
@ObjectType()
export class TransactionType {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Column({type: "varchar"})
    @Field(type => String)
    name?: string;

    @OneToMany(() => Transaction, transaction => transaction.transactionTypeId)
    transaction: Transaction[];
}