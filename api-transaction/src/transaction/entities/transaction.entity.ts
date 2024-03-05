import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from '../../common/enums/transaction';

@Entity({ name: 'transactions' })
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  accountExternalIdDebit: string;

  @Column()
  @Field(() => String)
  accountExternalIdCredit: string;

  @Column()
  @Field(() => Int)
  tranferTypeId: number;

  @Column({ 
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  @Field(() => Int)
  transactionStatus: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  value: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => String)
  createdAt: Date;
}
