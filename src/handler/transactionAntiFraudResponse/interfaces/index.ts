import { ETransactionAntiFraudResponse } from "../../../transaction";

export interface IProcessAntiFraudResponseMessage {
  key: string;
  value: {
    transactionStatus: ETransactionAntiFraudResponse;
  };
}
