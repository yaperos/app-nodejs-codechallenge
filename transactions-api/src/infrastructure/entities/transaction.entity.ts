import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity({ name: 'transactions' })
  export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    transactionExternalId: string;

    @Column('uuid')
    accountExternalIdDebit: string;

    @Column('uuid')
    accountExternalIdCredit: string;

    @Column('int')
    transferTypeId: number;

    @Column('float')
    value: number;

    @Column('int')
    status: number;

    @Column('timestamp')
    createdAt: Date;

    @Column('timestamp')
    updatedAt: Date;
  }