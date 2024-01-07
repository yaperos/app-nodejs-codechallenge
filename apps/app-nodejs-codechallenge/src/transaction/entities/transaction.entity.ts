import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  transactionExternalId: string;

  @Column()
  @Field()
  accountExternalIdDebit: string;

  @Column()
  @Field()
  accountExternalIdCredit: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  value: number;

  @Column({ type: 'int' })
  @Field(() => Int)
  transactionTypeId: number;

  @ManyToOne(
    () => TransactionType,
    (transactionType) => transactionType.transaction,
  )
  @Field(() => TransactionType)
  transactionType?: TransactionType;

  @Column({ type: 'int' })
  @Field(() => Int)
  transactionStatusId: number;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transaction,
  )
  @Field(() => TransactionStatus)
  transactionStatus?: TransactionStatus;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;

  @BeforeInsert()
  asignarFechaActual(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  actualizarFechaModificacion(): void {
    this.updatedAt = new Date();
  }
}
