import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
@Entity('transfer_type')
export class TransferType extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'varchar', name: 'name', length: 255, nullable: false, unique: true })
	public name: string;
}
