import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from '../transaction/transaction-status';

@Entity()
export class OutBox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
    type: 'varchar',
  })
  topic: string;

  @Column({
    length: 50,
    type: 'varchar',
  })
  key: string;

  @Column({
    length: 300,
    type: 'varchar',
  })
  value: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('bigint')
  createdAt: number;
}
