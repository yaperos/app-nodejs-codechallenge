import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  accountExternalIdDebit: string;

  @Column()
  @Field()
  accountExternalIdCredit: string;

  @Field((type) => Int)
  @Column()
  tranferTypeId: number;

  @Field((type) => Int)
  @Column()
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @Field((type) => Int)
  transactionStatus: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field()
  createdAt: string;
}
