import {
  Column,
  CreateDateColumn,
  Entity,
  FindOneOptions,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { dbService } from "../..";
import { CreateTransactionBody } from "../../handler/transaction/interfaces";
import { ETransactionAntiFraudResponse, transactionType } from "../app";
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

  @Index()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createAt: Date;

  public static async saveOne({
    accountExternalIdCredit,
    accountExternalIdDebit,
    transferTypeId,
    value,
  }: CreateTransactionBody): Promise<TransactionModel> {
    try {
      const transactionRecord = new TransactionModel();
      transactionRecord.id = uuidV4();
      transactionRecord.value = value;
      transactionRecord.accountExternalIdDebit = accountExternalIdDebit;
      transactionRecord.accountExternalIdCredit = accountExternalIdCredit;
      transactionRecord.transferType = transactionType(transferTypeId);

      const transactionAntiFraudRecord =
        await TransactionAntiFraudResponseModel.saveOne({
          transaction: transactionRecord,
          transactionStatus: ETransactionAntiFraudResponse.PENDING,
        });

      transactionRecord.antiFraudResponse = transactionAntiFraudRecord;

      await dbService
        .dataSource()
        .getRepository(TransactionModel)
        .save(transactionRecord);

      return transactionRecord;
    } catch (error) {
      console.error("TransactionModel.saveOne", error);
      throw error;
    }
  }

  public static async findOne(options: FindOneOptions<TransactionModel>) {
    try {
      return await dbService
        .dataSource()
        .getRepository(TransactionModel)
        .findOne(options);
    } catch (error) {
      console.error("TransactionModel.findOne", error);
      throw error;
    }
  }
}
