import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('type_transactions')
export class TypeTransactionsEntity {
  @PrimaryGeneratedColumn('increment')
  public type_transaction_id: number;

  @Column({ nullable: false, length: 255 })
  public name: string;

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
