import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm'

@ObjectType()
@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;
}

@ObjectType()
@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;
}

@ObjectType()
@Entity()
export class RetrieveTransaction {

  @Field()
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Field(() => TransactionType)
  @OneToOne(() => TransactionType, { eager: true })
  @JoinColumn()
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  @OneToOne(() => TransactionStatus, { eager: true })
  @JoinColumn()
  transactionStatus: TransactionStatus;

  @Field((type) => Int)
  @Column()
  value: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
