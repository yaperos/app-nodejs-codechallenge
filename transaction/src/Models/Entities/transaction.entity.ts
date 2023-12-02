import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'transactionExternalId', length: 36 })
  transactionExternalId: string;

  @Column({ type: 'varchar', name: 'accountExternalIdDebit', length: 36 })
  accountExternalIdDebit: string;

  @Column({ type: 'varchar', name: 'accountExternalIdCredit', length: 36 })
  accountExternalIdCredit: string;

  @Column({ type: 'int', name: 'tranferTypeId' })
  tranferTypeId: number;

  @Column({ type: 'varchar', name: 'transactionType' })
  transactionType: string;

  @Column({ type: 'varchar', name: 'transactionStatus' })
  transactionStatus: string;

  @Column({ type: 'numeric', name: 'value' })
  value: number;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'update_at' })
  updateAt: Date;
}
