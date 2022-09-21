import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  accountExternalIdDebit: string;

  @Column({ length: 50 })
  accountExternalIdCredit: string;

  @Column('int')
  tranferTypeId: number;

  @Column('float')
  value: number;

  @Column({ default: 'pending', length: 15 })
  status: string;
}
