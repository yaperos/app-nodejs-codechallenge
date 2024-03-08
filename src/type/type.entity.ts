import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { Transaction } from '../transactions/transaction.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
@Entity({name: 'transactions_type'})
export class Type{

	@Field((type) => Int)
	@PrimaryGeneratedColumn()
	id : number

	@Field()
	@Column({unique: true})	
	name : string
	
	@Field()
	@Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
	createdAt : Date
	

	@OneToMany(() => Transaction, (transaction) => transaction.transactionType)
	@Field(() => [Transaction], { nullable : false})
	transactions: Transaction[]


}