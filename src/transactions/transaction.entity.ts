import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm'
import { Type } from '../type/type.entity'
import { Status } from '../status/status.entity'


@Entity({name: 'transactions'})
export class Transaction{

	@PrimaryGeneratedColumn()
	id : number

	@Column({unique: true})	
	transactionExternalId : string

	@OneToOne( () => Type )
	@JoinColumn()
	transactionType : Type


	@OneToOne( () => Status )
	@JoinColumn()
	transactionStatus : Status

	@Column({nullable: true})
	value : number
	

	@Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
	createdAt : Date
	

}