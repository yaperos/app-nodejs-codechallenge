import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { TransactionStatusEnum } from 'src/utils/transactionStatus.enum';

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  transactionExternalId: string;

  @Column({ type: 'uuid' })
  @Field(() => String)
  accountExternalIdDebit: string;

  @Column({ type: 'uuid' })
  @Field(() => String)
  accountExternalIdCredit: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  tranferTypeId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float)
  value: number;

  @Column({ type: 'enum', enum: TransactionStatusEnum, default: 'pending' })
  @Field(() => String)
  transactionStatus: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  updatedAt: Date;
}