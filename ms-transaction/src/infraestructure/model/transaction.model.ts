import { TransactionEntity } from 'src/domain/Transaction.entity';
import { Status } from 'src/helper/const.helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Transaction')
export class TransactionModel implements TransactionEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50 })
  accountExternalIdDebit: string;

  @Column({ length: 50 })
  accountExternalIdCredit: string;

  @Column()
  tranferTypeId: number;

  @Column()
  value: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
