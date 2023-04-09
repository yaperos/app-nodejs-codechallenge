import { TransactionModel } from "../infra";

export class GetTransactionDTOFromTransactionModel {
  public static transform(transactionRecord: TransactionModel) {
    return {
      transactionExternalId: transactionRecord.id,
      transactionType: {
        name: transactionRecord.transferType,
      },
      transactionStatus: {
        name: transactionRecord.antiFraudResponse?.transactionStatus,
      },
      value: transactionRecord.value,
      createdAt: transactionRecord.createAt,
    };
  }
}
