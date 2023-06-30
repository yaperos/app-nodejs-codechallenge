import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
} from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
      transactionExternalId: string;

    @Column()
      accountExternalIdDebit: string;

    @Column()
      accountExternalIdCredit: string;

    @Column()
      transactionType: number;

    @Column()
      value: number;

    @Column({ default: 'pending' })
      transactionStatus: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      createdAt: Date;
}
