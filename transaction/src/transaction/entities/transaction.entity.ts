import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transaction')
export class Transaction extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	public id: number;

	@Column({ type: 'varchar', name: 'transaction_external_id', length: 36 })
	public transactionExternalId: string;

	@Column({ type: 'varchar', name: 'account_external_id_debit', length: 36 })
	public accountExternalIdDebit: string;

	@Column({ type: 'varchar', name: 'account_external_id_credit', length: 36 })
	public accountExternalIdCredit: string;

	@Column({ type: 'int', name: 'tranfer_type_id' })
	public tranferTypeId: number;

	@Column({ type: 'varchar', name: 'transaction_type' })
	public transactionType: string;

	@Column({ type: 'varchar', name: 'transaction_status' })
	public transactionStatus: string;

	@Column({ type: 'numeric', name: 'value' })
	public value: number;

	@Column({ type: 'timestamp', name: 'created_at' })
	public createdAt: Date;

	@Column({ type: 'timestamp', name: 'update_at' })
	public updateAt: Date;
}
