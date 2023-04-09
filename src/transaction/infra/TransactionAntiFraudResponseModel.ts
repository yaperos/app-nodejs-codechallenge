import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { ETransactionAntiFraudResponse } from "../app";
import { TransactionModel } from "./TransactionModel";

@Entity()
export class TransactionAntiFraudResponseModel {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column({
    type: "enum",
    enum: ETransactionAntiFraudResponse,
    default: ETransactionAntiFraudResponse.PENDING,
  })
  transactionStatus: ETransactionAntiFraudResponse;

  @OneToOne(
    () => TransactionModel,
    (transaction) => transaction.antiFraudResponse
  )
  transaction: TransactionModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
