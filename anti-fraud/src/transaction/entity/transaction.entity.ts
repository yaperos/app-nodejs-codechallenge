import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  // eslint-disable-next-line prettier/prettier
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column()
  @Generated('uuid')
  transactionExternalId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column({ type: 'int' })
  tranferTypeId: number;

  @Column()
  status: string;

  @Column({ type: 'int' })
  value: number;

  @CreateDateColumn({ type: 'date', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;
}
