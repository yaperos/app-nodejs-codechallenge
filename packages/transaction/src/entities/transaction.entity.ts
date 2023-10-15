import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Status } from "../enums/status.enum";
import { TransactionType } from "../enums/transaction-type.enum";

@Entity({
  name: "transaction",
})
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
    name: "account_external_id_credit",
  })
  accountExternalIdCredit: string;

  @Column({
    nullable: false,
    name: "account_external_id_debit",
  })
  accountExternalIdDebit: string;

  @Column({
    nullable: false,
  })
  value: number;

  @Column({
    enum: Status,
    nullable: false,
  })
  status: string;

  @Column({
    enum: TransactionType,
    nullable: false,
  })
  type: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
    name: "updated_at",
  })
  updatedAt: Date;
}
