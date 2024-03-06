import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import { Transaction } from '../transactions/transaction.entity';

@Entity({name: 'transactions_status'})
export class Status{

	@PrimaryGeneratedColumn()
	id : number

	@Column({unique: true})	
	name : string
	
	@OneToMany(() => Transaction, (transaction) => transaction.transactionType)
	transactions: Transaction[]


	@Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
	createdAt : Date
	

}