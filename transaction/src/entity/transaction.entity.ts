import { STATUS_TRANSACTION } from 'src/constants/transaction-status.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TYPE_TRANSACTION } from 'src/constants/transaction-type.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  accountExternalIdDebit: string;

  @Column()
  @ApiProperty()
  accountExternalIdCredit: string;

  @Column()
  @ApiProperty()
  transferTypeId: number;

  @Column()
  @ApiProperty()
  value: number;

  @Column()
  @Generated('uuid')
  @ApiProperty()
  transactionExternalId: string;

  @Column()
  @ApiProperty()
  transactionType: TYPE_TRANSACTION;

  @Column()
  @ApiProperty()
  transactionStatus: STATUS_TRANSACTION;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}
