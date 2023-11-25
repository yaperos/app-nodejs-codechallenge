// src/transaccion/transaccion.model.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from '../enums';

@Entity()
export class TransaccionEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  transferTypeId: number;

  @Column('int')
  value: number;

  @Column({ default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
