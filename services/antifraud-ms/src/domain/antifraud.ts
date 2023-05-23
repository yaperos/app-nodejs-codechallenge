import { NonFunctionProperties } from "@app-nodejs-codechallenge/shared-lib";

export const transactionStatus = ["pending", "approved", "rejected"] as const;
export type TransactionStatus = (typeof transactionStatus)[number];

export class Antifraud {
  transaction: {
    transactionExternalId: string;

    transactionStatus: {
      name: TransactionStatus;
    };
  };

  score?: number;

  constructor(data?: NonFunctionProperties<Antifraud>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
