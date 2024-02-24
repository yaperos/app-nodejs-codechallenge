import { Entity, PrimaryGeneratedColumn, Column, Timestamp, BeforeInsert} from 'typeorm';

import { Type } from 'class-transformer';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'account_external_id_debit' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit' })
  accountExternalIdCredit: string;

  @Column({ name: 'tranfer_type' })
  tranferType: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'value' })
  value: number;

  @Column({ name: 'created_at' })
  @Type(() => Timestamp)
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @Type(() => Timestamp)
  updatedAt: Date;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = new Date();
  }
}
