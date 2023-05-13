type EventMetadata = {
  origin: string;
  date: Date;
};

export type OutputTransactionEventApproved = {
  meta: EventMetadata;
  data: {
    transactionExternalId: string;
  };
};

export type OutputTransactionEventRejected = {
  meta: EventMetadata;
  data: {
    transactionExternalId: string;
    reason: string;
  };
};
