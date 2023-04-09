import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { TransactionAntiFraudResponseModel } from "./TransactionAntiFraudResponseModel";

@Entity()
export class TransactionModel {
  @PrimaryColumn()
  id: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Index()
  @Column({ type: "varchar" })
  transferType: string;

  @Column()
  value: number;

  @OneToOne(
    () => TransactionAntiFraudResponseModel,
    (transactionAntiFraudResponse) => transactionAntiFraudResponse.transaction
  )
  @JoinColumn()
  antiFraudResponse: TransactionAntiFraudResponseModel;

  @CreateDateColumn()
  createAt: Date;

  findById() {}
}
