import { TransactionCommandTypeEnum, TransactionStatusEnum } from "@shared/contracts";

export type TransactionCommand =
| { 
    type: TransactionCommandTypeEnum.CREATE_TRANSACTION
    value: number
    createdAt: Date
    externalId: string
    transferTypeId: string
    accountExternalIdDebit: string
    accountExternalIdCredit: string
  }
| { 
    type: TransactionCommandTypeEnum.VALIDATE_TRANSACTION
    externalId: string;
    status: TransactionStatusEnum;
  };