import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TransactionStatus } from "../../domain/enums/transaction-status.enum";

@Entity("transactions")
@ObjectType()
export class TransactionEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field({ description: "ID field (uuid)" })
  id: string;

  @Column({ nullable: false })
  @Field({ description: "External debit account ID field (uuid)" })
  accountExternalIdDebit: string;

  @Column({ nullable: false })
  @Field({ description: "External credit account ID field (uuid)" })
  accountExternalIdCredit: string;

  @Column({ nullable: false })
  @Field(() => Int, { description: "Tranfer type ID field (int)" })
  transferTypeId: number;

  @Column({ nullable: false, default: TransactionStatus.PENDING })
  @Field({ description: "Status field (string)" })
  status: string;

  @Column({ nullable: false })
  @Field(() => Int, { description: "Value field (number)" })
  value: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field({ description: "Field created at (Date)" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  @Field({ description: "Field update at (Date)" })
  updatedAt: Date;
}
