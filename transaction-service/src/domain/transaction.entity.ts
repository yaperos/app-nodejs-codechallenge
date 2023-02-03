import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 36 })
  accountExternalIdDebit: string;

  @Column({ length: 36 })
  accountExternalIdCredit: string;

  @Column('int', { default: 1 })
  tranferTypeId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
