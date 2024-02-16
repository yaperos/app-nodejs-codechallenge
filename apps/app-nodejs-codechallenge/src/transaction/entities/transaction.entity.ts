import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { StatusEnum } from "../enums/status.enum";

@Entity("transactions")
export default class Transaction {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({
    type: "uuid",
    nullable: true,
    unique: true,
    name: "account_external_id_debit",
  })
  accountExternalIdDebit: string;

  @Column({
    type: "uuid",
    nullable: true,
    unique: true,
    name: "account_external_id_credit",
  })
  accountExternalIdCredit: string;

  @Column({ type: "int", name: "transfer_type_id" })
  transferTypeId: number;

  @Column({ type: "numeric" })
  value: number;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.PENDING,
    name: "status_transaction",
  })
  statusTransaction: StatusEnum;
}
