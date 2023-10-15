import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column({ nullable: false })
  status: string;

  @Column()
  @Generated('uuid')
  accountExternalIdDebit: string;

  @Column()
  @Generated('uuid')
  accountExternalIdCredit: string;

  @Column({ default: 1 })
  tranferTypeId: number;
}
