import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';
import { TransactionType } from './transaction-type.entity';
import { TransferType } from './transfer-type.entity';

@Entity('transaction')
export class Transaction extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'varchar', name: 'transaction_external_id', length: 36, nullable: false, unique: true })
	public transactionExternalId: string;

	@Column({ type: 'varchar', name: 'account_external_id_debit', length: 36, nullable: true })
	public accountExternalIdDebit: string;

	@Column({ type: 'varchar', name: 'account_external_id_credit', length: 36, nullable: true })
	public accountExternalIdCredit: string;

	@Column({ type: 'int', name: 'transaction_type_id', nullable: false })
	public transactionTypeId: number;

	@ManyToOne(() => TransactionType, { eager: true })
	@JoinColumn({ name: 'transaction_type_id', referencedColumnName: 'id' })
	public transactionType: TransactionType;

	@Column({ type: 'int', name: 'transaction_status_id', nullable: false })
	public transactionStatusId: number;

	@ManyToOne(() => TransactionStatus, { eager: true })
	@JoinColumn({ name: 'transaction_status_id', referencedColumnName: 'id' })
	public transactionStatus: TransactionStatus;

	@Column({ type: 'int', name: 'transfer_type_id', nullable: false })
	public transferTypeId: number;

	@ManyToOne(() => TransferType, { eager: true })
	@JoinColumn({ name: 'transfer_type_id', referencedColumnName: 'id' })
	public transferType: TransferType;

	@Column({ type: 'numeric', name: 'value', nullable: false })
	public value: number;

	@Column({ type: 'timestamp', name: 'created_at', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
	public createdAt: Date;

	@Column({ type: 'timestamp', name: 'update_at', nullable: true, default: null })
	public updateAt: Date;
}
