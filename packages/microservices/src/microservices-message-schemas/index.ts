export interface Message {
  value: string;
}

export interface MessageSchema {}

export class MessageSerializer {
  static serialize<T extends MessageSchema>(value: T): Message {
    return { value: JSON.stringify(value) };
  }
}

export interface TransactionCreatedMessageSchema extends MessageSchema {
  transactionId: string;
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

export interface TransactionCreationMessageSchema extends MessageSchema {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

export interface TransactionRejectedMessageSchema extends MessageSchema {
  transactionId: string;
  reason: string;
}

export interface TransactionApprovedMessageSchema extends MessageSchema {
  transactionId: string;
}

export interface TransactionStatusUpdatedMessageSchema extends MessageSchema {
  id: string;
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  value: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
