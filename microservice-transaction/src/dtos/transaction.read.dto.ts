import { AutoMap } from "@automapper/classes";
import { TransactionStatus } from "src/common/transaction.enum";

export class TransactionReadDTO {
  @AutoMap()
  readonly transactionExternalId: string
  
  readonly transactionType: {
    name: number;
  };

  readonly transactionStatus: {
    name: TransactionStatus;
  };

  @AutoMap()
  readonly value: number;

  @AutoMap()
  readonly createdAt: number;
}
