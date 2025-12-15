import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  transferTypeId: number;

  @Column('decimal')
  value: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;

  @VersionColumn()
  version: number;
}