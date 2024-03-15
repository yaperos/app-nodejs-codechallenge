import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionCatalogEntity } from './TransactionCatalog.entity';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'transaction_external_id' })
  transactionExternalId: string;

  @Column({ name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Column({ name: 'transaction_type' })
  transactionTypeId: number;

  @OneToOne(() => TransactionCatalogEntity, (catalog) => catalog.id, {
    lazy: false,
  })
  @JoinColumn({ name: 'transaction_type' })
  transactionType: TransactionCatalogEntity;

  @Column({ name: 'transaction_status' })
  transactionStatusId: number;

  @OneToOne(() => TransactionCatalogEntity, (catalog) => catalog.id, {
    lazy: false,
  })
  @JoinColumn({ name: 'transaction_status' })
  transactionStatus: TransactionCatalogEntity;

  @Column()
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
