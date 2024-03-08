import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { Transaction } from '../transactions/transaction.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
@Entity({name: 'transactions_status'})
export class Status{

	@Field((type) => Int)
	@PrimaryGeneratedColumn()
	id : number

	@Field()
	@Column({unique: true})	
	name : string
	
	@OneToMany(() => Transaction, (transaction) => transaction.transactionType)
	@Field(() => [Transaction], { nullable : false})
	transactions: Transaction[]

	@Field()
	@Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
	createdAt : Date
	

}