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
import { cacheService, dbService } from "../..";
import { ECacheCollection } from "../../infrastructure/cache";
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
    transactionStatus: ETransactionAntiFraudResponse,
    transactionId?: string
  ) {
    try {
      if (
        transactionId &&
        cacheService.has(ECacheCollection.transactions, transactionId)
      ) {
        const deletedItems = cacheService.delete(
          ECacheCollection.transactions,
          transactionId
        );

        if (deletedItems) {
          console.info(
            `No in-memory item found with id ${transactionId} in the collection ${ECacheCollection.transactions}`
          );
        }

        console.info(
          `${deletedItems} in-memory items deleted in the collection ${ECacheCollection.transactions}`
        );
      }

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
