import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'transaction', schema: 'trx' })
export class Transaction {
  @ApiProperty()
  @PrimaryColumn()
  id!: string;

  @ApiProperty()
  @Column({ name: 'account_external_id_debit' })
  accountExternalIdDebit!: string;

  @ApiProperty()
  @Column({ name: 'account_external_id_credit' })
  accountExternalIdCredit!: string;

  @ApiProperty()
  @Column({ name: 'transaction_type_code' })
  transactionTypeCode!: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @ApiProperty()
  @Column({ default: 'PENDING' })
  status!: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
