import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { Transaction } from '../transactions/transaction.entity';

@Entity({name: 'transactions_type'})
export class Type{

	@PrimaryGeneratedColumn()
	id : number

	@Column({unique: true})	
	name : string
	
	@Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
	createdAt : Date
	

	@OneToMany(() => Transaction, (transaction) => transaction.transactionType)
	transactions: Transaction[]


}