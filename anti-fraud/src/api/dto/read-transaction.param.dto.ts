interface bodyData {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  transactionStatus: number;
}

export class AntiFraudDto {
  readonly topic: string;
  readonly partition: number;
  readonly value: {
    subject: string;
    data: bodyData;
  };
}
