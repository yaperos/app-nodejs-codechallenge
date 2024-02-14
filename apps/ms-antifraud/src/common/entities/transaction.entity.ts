import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@Entity({ name: 'transactions' }) 
export class Transaction {

  @PrimaryGeneratedColumn('uuid') 
  transactionExternalId: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  accountExternalIdDebit: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  accountExternalIdCredit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value: number;

  @Column({ type: 'int', nullable: false })
  transferTypeId: number

  @ManyToOne(() => TransactionType, { eager: true })
  @JoinColumn({ name: 'transferTypeId' })
  transactionType: TransactionType;

  @Column({ type: 'int', nullable: false })
  transferStatusId: number;

  @ManyToOne(() => TransactionStatus, { eager: true })
  @JoinColumn({ name: 'transferStatusId' })
  transactionStatus: TransactionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
