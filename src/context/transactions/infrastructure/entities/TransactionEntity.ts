/* eslint-disable no-unused-vars */
import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
    id?: string;

  @Column()
    accountExternalIdDebit!: string;

  @Column()
    accountExternalIdCredit!: string;

  @Column()
    transferTypeId!: number;

  @Column()
    value!: number;

  @Column()
    transactionExternalId!: string;

  @Column()
    transactionType?: string;

  @Column()
    status!: string;

  @Column()
    createdAt!: Date;

  @Column({ nullable: true })
    updatedAt?: Date;
}
