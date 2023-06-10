import { TransactionEntityDto } from '../../../domain/dtos/entities/transaction-entity.dto';
import { Builder } from 'builder-pattern';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from '../../../domain/enums/transaction-type';
import { TransactionStatus } from '../../../domain/enums/transaction-status';

@Entity('transactions')
export class TransactionTable {
  @PrimaryColumn('uuid')
  transactionExternalId: string;

  @Column({ nullable: true })
  accountExternalIdDebit: string;

  @Column({ nullable: true })
  accountExternalIdCredit: string;

  @Column()
  value: number;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  transactionStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toEntity(): TransactionEntityDto {
    return Builder<TransactionEntityDto>()
      .transactionExternalId(this.transactionExternalId)
      .accountExternalIdDebit(this.accountExternalIdDebit)
      .value(this.value)
      .transactionType(this.transactionType)
      .transactionStatus(this.transactionStatus)
      .build();
  }
}
