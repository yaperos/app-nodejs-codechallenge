type EventMetadata = {
  origin: string;
  date: Date;
};

export type InputTransactionEvent = {
  meta: EventMetadata;
  data: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    value: number;
    transactionExternalId: string;
  };
};
