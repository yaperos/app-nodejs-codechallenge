import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  accountExternalIdDebit: string;

  @Column('uuid')
  accountExternalIdCredit: string;

  @Column('int')
  tranferTypeId: number;

  @Column('float')
  value: number;

  @Column({ default: 'pending', length: 15 })
  status: string;
}
