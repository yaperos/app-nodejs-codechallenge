import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { STATUS_TYPE } from '../../domain/transaction';
import { COMMAND_DATABASE_SCHEMA } from '../constants';
import { BaseEntity } from './base.entity';

@Entity({ name: COMMAND_DATABASE_SCHEMA })
export class TransactionEntity extends BaseEntity {
  @ObjectIdColumn()
  id: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  tranferTypeId: number;

  @Column()
  transactionStatus: STATUS_TYPE;

  @Column()
  value: number;
}
