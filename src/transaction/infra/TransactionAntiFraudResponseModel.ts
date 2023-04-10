import {
  Column,
  CreateDateColumn,
  Entity,
  FindOneOptions,
  Index,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { dbService } from "../..";
import { ETransactionAntiFraudResponse } from "../app";
import { TransactionModel } from "./TransactionModel";
import { ITransactionAntiFraudResponseSaveOne } from "./interfaces";

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

  @Index()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  public static async saveOne({
    transaction,
    transactionStatus,
  }: ITransactionAntiFraudResponseSaveOne): Promise<TransactionAntiFraudResponseModel> {
    try {
      const transactionAntiFraudRecord =
        new TransactionAntiFraudResponseModel();
      transactionAntiFraudRecord.id = uuidV4();
      transactionAntiFraudRecord.transactionStatus = transactionStatus;
      transactionAntiFraudRecord.transaction = transaction;

      await dbService
        .dataSource()
        .getRepository(TransactionAntiFraudResponseModel)
        .save(transactionAntiFraudRecord);

      return transactionAntiFraudRecord;
    } catch (error) {
      console.error("TransactionAntiFraudResponseModel.saveOne", error);
      throw error;
    }
  }

  public static async getById(id: string) {
    try {
      return await dbService
        .dataSource()
        .getRepository(TransactionAntiFraudResponseModel)
        .findOne({ where: { id } });
    } catch (error) {
      console.error("TransactionAntiFraudResponseModel.getById", error);
      throw error;
    }
  }

  public static async findOne(
    options: FindOneOptions<TransactionAntiFraudResponseModel>
  ) {
    try {
      return await dbService
        .dataSource()
        .getRepository(TransactionAntiFraudResponseModel)
        .findOne(options);
    } catch (error) {
      console.error("TransactionAntiFraudResponseModel.findOne", error);
      throw error;
    }
  }

  async updateTransactionStatus(
    transactionStatus: ETransactionAntiFraudResponse
  ) {
    try {
      await dbService
        .dataSource()
        .getRepository(TransactionAntiFraudResponseModel)
        .update({ id: this.id }, { transactionStatus });
    } catch (error) {
      console.error("TransactionAntiFraudResponseModel.update", error);
      throw error;
    }
  }
}
