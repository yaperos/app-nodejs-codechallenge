import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TransactionStatus } from 'src/transaction-status/transaction-status.entity';
import { TransactionType } from 'src/transaction-type/transaction-type.entity';

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column()
  @Field()
  accountExternalIdDebit: string;

  @Column()
  @Field()
  accountExternalIdCredit: string;

  @Column()
  @Field()
  value: number;

  @Column()
  @Field()
  createdAt: Date = new Date();;

  @Column()
  @Field((type) => String)
  transactionStatusID: string = '1';

  @Field(() => TransactionStatus)
  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transactions,
  )
  transactionStatus: TransactionStatus;

  @Column()
  @Field((type) => String)
  transacionTypeId: string;

  @Field(() => TransactionType)
  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
  )
  transactionType: TransactionType;
}
