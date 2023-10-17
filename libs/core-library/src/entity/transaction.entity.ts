import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';
import { Audit } from './audit.entity';
import { TransferType } from './transfer-type.entity';
import { TransactionType } from './transaction-type.entity';

@Entity()
export class Transaction extends Audit {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('uuid', { nullable: false, name: 'transaction_external_id' })
  transactionExternalId: string;

  @Column('uuid', { nullable: false, name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column('uuid', { nullable: false, name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Column('int', { nullable: false, name: 'transfer_type_id' })
  tranferTypeId: number;

  @Column('float', { nullable: false, name: 'value' })
  value: number;

  @Column('int', { nullable: false, name: 'transaction_type_id' })
  transactionTypeId: number;

  @Column('int', { nullable: false, name: 'transaction_status_id' })
  transactionStatusId: number;

  @ManyToOne(() => TransactionStatus, { eager: true })
  @JoinColumn({
    name: 'transaction_status_id',
    referencedColumnName: 'id',
  })
  transactionStatus?: TransactionStatus;

  @ManyToOne(() => TransferType, { eager: true })
  @JoinColumn({
    name: 'transfer_type_id',
    referencedColumnName: 'id',
  })
  transferType?: TransferType;

  @ManyToOne(() => TransactionType, { eager: true })
  @JoinColumn({
    name: 'transaction_type_id',
    referencedColumnName: 'id',
  })
  transactionType?: TransactionType;
}
