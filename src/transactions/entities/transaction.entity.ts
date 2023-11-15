import {
  BeforeInsert,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class TransactionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  accountExternalIdCredit: string;

  @Column()
  tranferTypeId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  checkTransactionValue() {
    if (this.value > 1000) {
      this.status = 'rejected';
    }
  }
}
