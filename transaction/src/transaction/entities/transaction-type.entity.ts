import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
@Entity('transaction_type')
export class TransactionType extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'varchar', name: 'name', length: 255, nullable: false, unique: true })
	public name: string;
}
