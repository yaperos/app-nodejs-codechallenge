import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity({name: 'transactions_type'})
export class Type{

	@PrimaryGeneratedColumn()
	id : number

	@Column({unique: true})	
	name : string
	
	@Column({type:'datetime', default: () => 'CURRENT_TIMESTAMP'})
	createdAt : Date
	

}