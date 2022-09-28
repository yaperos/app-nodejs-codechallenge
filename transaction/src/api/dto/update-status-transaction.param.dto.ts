interface bodyData {
  id: string;
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
