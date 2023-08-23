import {
  ITransaction,
  ITransactionBody,
} from "../../types/transaction/Transaction";
import { ITransactionRepository } from "../../types/transaction/TransactionRepository";
import { ApiClient } from "../../utils/ApiClient";
import { AxiosResponse } from "axios";

export class ApiTransactionRepository implements ITransactionRepository {
  private apiClient: ApiClient;
  constructor() {
    this.apiClient = ApiClient.getInstance();
  }
  async getById(transactionExternalId: string): Promise<ITransaction> {
    const response: AxiosResponse<{ data: ITransaction }> = await this.apiClient
      .getHttpClient()
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/transaction-verify/${transactionExternalId}`
      );
    return response.data.data;
  }

  async createTransaction(
    iTransactionBody: ITransactionBody
  ): Promise<ITransaction> {
    const response: AxiosResponse<{ data: ITransaction }> = await this.apiClient
      .getHttpClient()
      .post(`${import.meta.env.VITE_API_URL}/transaction-verify`, {
        ...iTransactionBody,
        value: parseInt(iTransactionBody.value),
      });
    return response.data.data;
  }
}
