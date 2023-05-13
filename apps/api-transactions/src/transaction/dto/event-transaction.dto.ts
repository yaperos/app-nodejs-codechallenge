type EventMetadata = {
  origin: string;
  date: Date;
};

export type TransactionEvent = {
  meta: EventMetadata;
  data: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    value: number;
    transactionExternalId: string;
  };
};
