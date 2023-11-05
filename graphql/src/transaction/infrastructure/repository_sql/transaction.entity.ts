import { StatusesEnum } from 'src/transaction/domain/enum/transaction.statuses';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'transactions' })
export class TransactionEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  accountExternalIdDebit: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  accountExternalIdCredit: string;

  @Field()
  @Column({ type: 'numeric' })
  tranferTypeId: number;

  @Field()
  @Column({ type: 'numeric' })
  value: number;

  @Field()
  @Column({ type: 'enum', enum: StatusesEnum, default: StatusesEnum.PENDING })
  status: StatusesEnum;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
