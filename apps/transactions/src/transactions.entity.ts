import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  @Generated('uuid')
  accountExternalIdDebit: string;

  @Column()
  @Generated('uuid')
  accountExternalIdCredit: string;

  @Column({ default: 1 })
  tranferTypeId: number;

  @CreateDateColumn()
  createdAt: Date;
}
