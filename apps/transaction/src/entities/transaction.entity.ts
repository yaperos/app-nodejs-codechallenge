import { Directive, ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionStatus } from './transactionStatus.entity';
import { TransactionType } from './transactionType.entity';

@ObjectType()
@Directive('@key(fields: "transactionExternalId")')
@Entity('TRANSACTION')
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Field(() => String, { description: 'External ID of the debit account' })
  @Column()
  accountExternalIdDebit: string;

  @Field(() => String, { description: 'External ID of the credit account' })
  @Column()
  accountExternalIdCredit: string;

  @Field(() => Int, { description: 'Value of the transaction' })
  @Column()
  value: number;

  @Field(() => String, {
    description: 'Date of the transaction',
    nullable: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => TransactionStatus, (status) => status.name, {
    nullable: true,
  })
  status: TransactionStatus;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transactions,
  )
  @JoinColumn({ name: 'type_id' })
  @Field()
  transactionType: TransactionType;

  @ManyToOne(
    () => TransactionType,
    (transactionStatus) => transactionStatus.transactions,
  )
  @JoinColumn({ name: 'status_id' })
  @Field()
  transactionStatus: TransactionStatus;
}
