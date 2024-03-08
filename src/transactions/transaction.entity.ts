import {Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn} from 'typeorm'
import { Type } from '../type/type.entity'
import { Status } from '../status/status.entity'
import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType()
@Entity({name: 'transactions'})
export class Transaction{
	
	@Field()
 	@PrimaryGeneratedColumn("uuid")
 	id : string

 	@Field()
	@Column({unique: true})	
	transactionExternalId : string

	@ManyToOne(() => Type, (type) => type.transactions)
	@Field(() => Type)
	transactionType : Type

	@ManyToOne(() => Status, (status) => status.transactions)
	@Field(() => Status)
	transactionStatus : Status

	@Field( type => Float)
	@Column({nullable: true})
	value : number
	
	@Field()
	@Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
	createdAt : Date
	
}