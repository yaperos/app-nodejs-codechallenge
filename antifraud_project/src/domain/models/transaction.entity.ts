import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
