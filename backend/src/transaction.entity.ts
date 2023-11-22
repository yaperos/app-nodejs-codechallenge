import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
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
  tranferTypeId: number;

  @Field()
  @Column()
  value: number;

  @Field()
  @Column({ default: 'pending' }) 
  transactionStatus: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  async updateTransactionStatus(newStatus: string): Promise<void> {
    this.transactionStatus = newStatus;
    await this.save(); 
  }
}
