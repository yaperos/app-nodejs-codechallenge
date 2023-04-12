import { TransactionModel } from "../infra";
import { IGetTransactionResponse } from "./GetTransactionResponse.interface";

export class GetTransactionDTOFromTransactionModel {
  public static transform(
    transactionRecord: TransactionModel
  ): IGetTransactionResponse {
    return {
      transactionExternalId: transactionRecord.id,
      transactionType: {
        name: transactionRecord.transferType,
      },
      transactionStatus: {
        name: transactionRecord.antiFraudResponse?.transactionStatus,
      },
      value: transactionRecord.value,
      createdAt: transactionRecord.createAt.getTime(),
    };
  }
}
