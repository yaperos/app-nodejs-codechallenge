import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  transferTypeId: number;

  @Column()
  value: number;

  @Column({
    type: "enum",
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
