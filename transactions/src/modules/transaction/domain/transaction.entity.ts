import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  accountExternalIdDebit: string;

  @Column('uuid')
  accountExternalIdCredit: string;

  @Column('int')
  transferTypeId: number;

  @Column('decimal')
  value: number;

  @Column('varchar', { default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
