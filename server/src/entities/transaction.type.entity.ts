import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionTablesEnum } from '../enums/transaction.tables.enum';

@Entity({ name: TransactionTablesEnum.TRANSACTION_TYPE })
@ObjectType()
export class TransactionType {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar', length: 10 })
  @Field()
  name: string;
}
