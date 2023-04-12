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
import { cacheService, dbService } from "../..";
import { CreateTransactionBody } from "../../handler/transaction/interfaces";
import { ECacheCollection } from "../../infrastructure/cache";
import { ETransactionAntiFraudResponse, transactionType } from "../app";
import { TransactionAntiFraudResponseModel } from "./TransactionAntiFraudResponseModel";

@Entity()
export class TransactionModel {
  private static readonly _cacheCollection = ECacheCollection.transactions;

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

  public static async findById(
    id: string,
    options: Omit<FindOneOptions<TransactionModel>, "where">
  ) {
    try {
      const cacheTransactionModel = cacheService.get<TransactionModel>(
        TransactionModel._cacheCollection,
        id
      );

      if (cacheTransactionModel) {
        return cacheTransactionModel;
      }

      const transactionModelInstance = await dbService
        .dataSource()
        .getRepository(TransactionModel)
        .findOne({
          ...options,
          where: {
            id,
          },
        });

      if (!transactionModelInstance) {
        return null;
      }

      cacheService.set<TransactionModel>(
        TransactionModel._cacheCollection,
        id,
        transactionModelInstance
      );

      return transactionModelInstance;
    } catch (error) {
      console.error("TransactionModel.findById", error);
      throw error;
    }
  }
}
