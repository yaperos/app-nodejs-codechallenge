import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionType } from "./transaction-type.entity";
import { TransactionStatus } from "./transaction-status.entity";

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  transactionExternalId: string;

  @Column()
  @Field()
  accountExternalIdDebit: string;

  @Column()
  @Field()
  accountExternalIdCredit: string;

  @ManyToOne(() => TransactionType)
  @Field((type) => TransactionType)
  transactionType: TransactionType;

  @Column()
  @Field((type) => Int)
  transactionTypeId: number;

  @ManyToOne(() => TransactionStatus)
  @Field((type) => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Column()
  @Field((type) => Int)
  transactionStatusId: number;

  @Column()
  @Field((type) => Float)
  value: number;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  @Field()
  createdAt: Date;
}
