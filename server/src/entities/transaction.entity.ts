import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionStatus } from './transaction-status.entity';
import { TransactionType } from './transaction.type.entity';
import { TransactionTablesEnum } from '../enums/transaction.tables.enum';

@Entity({ name: TransactionTablesEnum.TRANSACTION })
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'transaction_external_id' })
  @Generated('uuid')
  @Field()
  transactionExternalId: string;

  @Column({ type: 'bigint' })
  @Field(() => Int)
  value: number;

  @Column({ name: 'account_external_id_debit', type: 'varchar', length: '20' })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit', type: 'varchar', length: '20' })
  accountExternalIdCredit: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  @Column({ type: 'smallint' })
  @Field(() => Int)
  transactionStatusId: number;

  @Column({ type: 'smallint' })
  @Field(() => Int)
  transactionTypeId: number;

  @Field(() => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field(() => TransactionType)
  transactionType: TransactionType;
}
