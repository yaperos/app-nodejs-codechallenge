import {Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn} from 'typeorm'
import { Type } from '../type/type.entity'
import { Status } from '../status/status.entity'


@Entity({name: 'transactions'})
export class Transaction{
	
 	@PrimaryGeneratedColumn("uuid")
 	id : string

	@Column({unique: true})	
	transactionExternalId : string

	@ManyToOne(() => Type, (type) => type.transactions)
	transactionType : Type

	@ManyToOne(() => Status, (status) => status.transactions)
	transactionStatus : Status

	@Column({nullable: true})
	value : number
	
	@Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
	createdAt : Date
	
}