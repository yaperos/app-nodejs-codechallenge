import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
@Entity('transaction_status')
export class TransactionStatus extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'varchar', name: 'name', length: 255, nullable: false, unique: true })
	public name: string;
}
