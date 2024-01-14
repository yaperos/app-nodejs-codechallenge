import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TransactionStatusEnum } from '@/enums/transaction-status.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

registerEnumType(TransactionStatusEnum, {
  name: 'TransactionStatusEnum',
});

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

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field(() => TransactionStatusEnum)
  @Column({
    type: 'enum',
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.PENDING,
  })
  status: TransactionStatusEnum;
}
