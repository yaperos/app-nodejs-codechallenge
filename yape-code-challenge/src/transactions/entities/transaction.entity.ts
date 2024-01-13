import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity('transaction')
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Field()
  @Column()
  accountExternalIdDebit: string;

  @Field()
  @Column()
  accountExternalIdCredit: string;

  @Field()
  @Column()
  transferTypeId: number;

  @Field()
  @Column()
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;
}
