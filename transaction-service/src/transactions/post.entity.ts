import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm'

@ObjectType()
@Entity()
export class TransactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;
}

@ObjectType()
@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;
}

@ObjectType()
@Entity()
export class RetrieveTransaction {

  @Field()
  @Column()
  @PrimaryGeneratedColumn()
  transactionExternalId: number;

  @Field(() => TransactionType)
  @ManyToOne(() => TransactionType, { eager: true })
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  @ManyToOne(() => TransactionStatus, { eager: true })
  transactionStatus: TransactionStatus;

  @Field((type) => Int)
  @Column()
  value: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
