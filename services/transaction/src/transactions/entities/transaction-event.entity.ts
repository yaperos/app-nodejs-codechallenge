import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
@ObjectType()
export class TransactionEvent {
  @PrimaryColumn("uuid")
  @Field()
  id: string;

  @Column()
  @Field()
  transactionExternalId: string;

  @Column()
  @Field((type) => Int)
  transactionTypeId: number;

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
