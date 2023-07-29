import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
  import { TransactionType } from './transactionType';
  import { TransactionStatus } from './transactionStatus';
  
  @Entity()
  @ObjectType()
  export class Transaction {
    @PrimaryGeneratedColumn()
    transactionInternalId: number;
  
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    transactionExternalId: string;
  
    @Column({ length: 36 })
    @Field()
    accountExternalIdDebit: string;
  
    @Column({ length: 36 })
    @Field()
    accountExternalIdCredit: string;
  
    @Column()
    tranferTypeId: number;

    @Column('numeric')
    @Field(() => Float)
    value: number;

    @Column()
    transactionTypeId: number;
  
    @ManyToOne(() => TransactionType, (type) => type.id)
    @Field()
    transactionType: TransactionType;
  
    @Column()
    transactionStatusId: number;
  
    @ManyToOne(() => TransactionStatus, (status) => status.id)
    @Field()
    transactionStatus: TransactionStatus;

    @CreateDateColumn()
    @Field()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }