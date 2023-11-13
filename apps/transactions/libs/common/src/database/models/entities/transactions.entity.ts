import { StatusTransaction } from '@app/common/utils/enum/status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionsEntity {
  @PrimaryGeneratedColumn('increment')
  public transaction_id: number;

  @Column({ nullable: false })
  public value: number;

  @Column({ nullable: false, length: 255 })
  public type: string;

  @Column('enum', {
    enum: StatusTransaction,
    default: StatusTransaction.PENDING,
    enumName: 'transaction_status_enum',
    nullable: false,
  })
  public status: StatusTransaction;

  @Column({ nullable: false, length: 255 })
  public accountExternalIdDebit: string;

  @Column({ nullable: false, length: 255 })
  public accountExternalIdCredit: string;

  @Column({ nullable: true, length: 255 })
  public transactionExternalId: string;

  @Column({ nullable: true })
  public created_by?: number | null;

  @Column({ nullable: true })
  public updated_by?: number | null;

  @Column({ nullable: true })
  public deleted_by?: number | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public created_at: string;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  public updated_at: string | null;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  public deleted_at?: string | null;
}
