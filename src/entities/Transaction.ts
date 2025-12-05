import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  transactionExternalId!: string;

  @Column()
  accountExternalIdDebit!: string;

  @Column()
  accountExternalIdCredit!: string;

  @Column()
  tranferTypeId!: number;

  @Column({ type: "numeric" })
  value!: number;

  @Column({ default: "pending" })
  transactionStatus!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
