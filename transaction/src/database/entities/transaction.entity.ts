import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransferType } from './trasfer-type.entity';
import { Status } from './status.entity';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_external_id_debit', type: 'varchar', length: 36 })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit', type: 'varchar', length: 36 })
  accountExternalIdCredit: string;

  @Column({ name: 'tranfer_type_id', type: 'int' })
  @ManyToOne(() => TransferType, (transferType) => transferType.id)
  tranferTypeId: number;

  @Column({ name: 'status_id', type: 'int' })
  @ManyToOne(() => Status, (status) => status.id)
  statusId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  transferType: TransferType;
  status: Status;
}
