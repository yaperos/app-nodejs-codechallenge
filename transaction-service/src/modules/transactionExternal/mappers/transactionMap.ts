/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueEntityID } from "clean-common-lib";
import {
  Guid,
  TransactionExternal,
  TransactionType,
  TransactionValue,
} from "../domain";

export class TransactionMap {
  public static toDTO(transaction: TransactionExternal) {
    console.log(transaction);
    return {
      transactionExternalId: transaction.id.toString(),
      transactionType: {
        name: TransactionType[transaction.type],
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value.value,
      createAt: transaction.createAt,
    };
  }

  public static toDomain(raw: any): TransactionExternal {
    const transaction = TransactionExternal.create(
      {
        accountExternalIdDebit: Guid.create(
          new UniqueEntityID(raw.accountExternalIdDebit)
        ).getValue(),
        accountExternalIdCredit: Guid.create(
          new UniqueEntityID(raw.accountExternalIdCredit)
        ).getValue(),
        type: raw.type,
        value: TransactionValue.create({ value: raw.value }).getValue(),
        status: raw.status,
        createAt: raw.createAt,
      },
      new UniqueEntityID(raw.id)
    );

    return transaction.getValue();
  }

  public static toPersistance(transaction: TransactionExternal): any {
    return {
      id: transaction.id.toValue(),
      accountExternalIdDebit: transaction.accountExternalIdDebit.id.toString(),
      accountExternalIdCredit:
        transaction.accountExternalIdCredit.id.toString(),
      type: transaction.type,
      value: transaction.value.value,
      status: transaction.status,
      createAt: transaction.createAt,
    };
  }
}
