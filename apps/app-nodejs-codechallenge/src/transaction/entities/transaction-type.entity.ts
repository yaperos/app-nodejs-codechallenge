import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
@ObjectType()
export class TransactionType {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  @Field(() => [Transaction], { nullable: true })
  transaction: Transaction[];

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
