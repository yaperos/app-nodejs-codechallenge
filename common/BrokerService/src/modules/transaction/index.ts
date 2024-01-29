import { BaseRequest } from "../../lib";
import { IGetTransactionsOptions, ITransactionsResponse } from "./interfaces";

class TransactionsBaseAPI {
  private request: BaseRequest;

  constructor() {
    this.request = new BaseRequest("TransactionService");
  }

  async getTransactions(
    query: IGetTransactionsOptions
  ): Promise<ITransactionsResponse | null> {
    try {
      const { data } = await this.request.send({
        path: "/api/v1/transactions",
        method: "GET",
        params: query,
      });

      return data || null;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }
}

export const TransactionsAPI = new TransactionsBaseAPI();
