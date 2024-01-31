import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity {

  @PrimaryGeneratedColumn('uuid',{name: 'transaction_external_id'})
  transactionExternalId: string;

  @Column('int',{name: 'type_id'})
  typeId: number;

  @Column('int',{name: 'status_id'})
  statusId: number;

  @Column('uuid',{name: 'account_external_id_debit'})
  accountExternalIdDebit: string;

  @Column('uuid',{name: 'account_external_id_credit'})
  accountExternalIdCredit: string;

  @Column('float',{name: 'value'})
  value: number;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

}