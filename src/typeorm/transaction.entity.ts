import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'transactions',database:'db'})
export class Transaction {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'transaction_id',
  })
  id: number;

  @Column({
    name: 'account_external_id_debit',
    nullable: false,
    default: '',
  })
  accountExternalIdDebit: string;

  @Column({
    name: 'account_external_id_credit',
    nullable: false,
    default: '',
  })
  accountExternalIdCredit: string;

  @Column({
    name: 'transfer_type_id',
    nullable: false,
    default: -1,
  })
  tranferTypeId: number;
  
  @Column({
    name: 'value',
    type: 'double precision',
    nullable: false,
    default: 0.0,
  })
  value: number;

  @Column({
    name: 'transaction_status',
    nullable: true,
    default: '',
  })
  transactionStatus: string;

  @Column({
    name: 'transaction_type',
    nullable: true,
    default: '',
  })
  transactionType: string;


  @Column({
    nullable: false,
    default: new Date(),
  })
  createdAt: Date;


}