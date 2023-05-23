import {
  BadRequestError,
  NonFunctionProperties,
} from "@app-nodejs-codechallenge/shared-lib";
import { Antifraud } from "./antifraud";

export const transactionType = ["debit", "credit"] as const;
export type TransactionType = (typeof transactionType)[number];

export const transactionStatus = ["pending", "approved", "rejected"] as const;
export type TransactionStatus = (typeof transactionStatus)[number];

export class Transaction {
  transactionExternalId: string;

  transactionType: {
    name: TransactionType;
  };

  transactionStatus: {
    name: TransactionStatus;
  };

  value: number;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(data?: NonFunctionProperties<Transaction>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public verifyFraud(antifraud: Antifraud) {
    if (this.transactionStatus.name !== "pending") {
      throw new BadRequestError({ message: "Transaction already processed" });
    }

    if (
      this.transactionExternalId !== antifraud.transaction.transactionExternalId
    ) {
      throw new BadRequestError({ message: "Invalid transaction" });
    }

    if (antifraud.score > 1000) {
      this.transactionStatus.name = "rejected";
    } else {
      this.transactionStatus.name = "approved";
    }
  }
}
