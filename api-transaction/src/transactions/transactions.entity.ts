/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  transactionId;

  @Column({type: 'varchar', length:50})
  accountExternalIdDebit;

  @Column({type: 'varchar', length:50})
  accountExternalIdCredit;

  @Column({type: 'smallint'})
  tranferTypeId;

  @Column({type: 'float8'})
  amount;

  @Column({type: 'varchar', default: 'PENDING'})
  status;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
