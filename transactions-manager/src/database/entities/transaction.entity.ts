import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@ObjectType()
export class TransactionType {
  @Field()
  name: string;
}

@ObjectType()
export class TransactionStatus {
  @Field()
  name: string;
}

@ObjectType()
@Entity('transactions')
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  accountExternalIdDebit: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  accountExternalIdCredit: string;

  @Field(() => Int)
  @Column({ type: 'decimal' })
  tranferTypeId: number;

  @Field(() => Int)
  @Column({ type: 'decimal' })
  value: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionExternalId?: string;

  @Field(() => TransactionType, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  transactionType?: TransactionType;

  @Field(() => TransactionStatus, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  transactionStatus?: TransactionStatus;

  @Field()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
