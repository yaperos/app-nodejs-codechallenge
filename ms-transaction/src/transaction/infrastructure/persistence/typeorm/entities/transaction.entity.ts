import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  accountExternalIdDebit: string;

  @Column({ nullable: false })
  accountExternalIdCredit: string;

  @Column({ nullable: false })
  transferTypeId: number;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
