import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@ObjectType({ description: 'transaction' })
@Entity()
export class Transaction {
  
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  accountExternalIdDebit: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  accountExternalIdCredit: string;

  @Field()
  @Column({ type: 'int' })
  tranferTypeId: number;

  @Directive('@upper')
  @Field()
  @Column({ type: 'varchar' })
  status: string;

  @Field()
  @Column({ type: 'int' })
  amount: number;
}
