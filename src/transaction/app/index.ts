export * from "./GetTransactionDTOFromTransactionModel";

enum ETransactionType {
  SEND = "SEND",
  RECEIVE = "RECEIVE",
}

export const transactionType = (type: number): ETransactionType => {
  switch (type) {
    case 1:
      return ETransactionType.SEND;
    case 2:
      return ETransactionType.RECEIVE;
    default:
      throw Error("Invalid type");
  }
};

export enum ETransactionAntiFraudResponse {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}
