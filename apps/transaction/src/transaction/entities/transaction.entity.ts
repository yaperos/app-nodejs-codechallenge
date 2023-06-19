import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TransactionStatus } from '@nodejs-codechallenge/shared/enum';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column('uuid')
  accountExternalIdDebit: string;

  @Column('uuid')
  accountExternalIdCredit: string;

  @Column('int')
  tranferTypeId: number;

  @Column('float')
  amount: number;

  @Column('int')
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @BeforeInsert()
  checkTransactionInsert() {
    if (!this.status) {
      this.status = TransactionStatus.PENDING;
    }
  }
}
