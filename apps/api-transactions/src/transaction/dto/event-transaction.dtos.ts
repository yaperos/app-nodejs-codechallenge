type EventMetadata = {
  origin: string;
  date: Date;
};

export type OutputTransactionEvent = {
  meta: EventMetadata;
  data: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    value: number;
    transactionExternalId: string;
  };
};

export type InputTransactionEventApproved = {
  meta: EventMetadata;
  data: {
    transactionExternalId: string;
  };
};

export type InputTransactionEventRejected = {
  meta: EventMetadata;
  data: {
    transactionExternalId: string;
    reason: string;
  };
};
