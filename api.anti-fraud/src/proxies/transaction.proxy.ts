import { AxiosInstance } from 'axios';
import { AppConfig } from '../configuration';

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Transaction {
  _id: string;
  status: TransactionStatus;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;

  createdAt: Date;
  updatedAt?: Date;
}

export class TransactionProxy {
  constructor(
    private readonly config: AppConfig,
    private readonly http: AxiosInstance,
  ) {}

  async findById(id: string) {
    const { data } = await this.http.get<Transaction>(
      `${this.config.API_TRANSACTION_URL}/transactions/${id}`,
    );

    return data;
  }

  async updateStatus(id: string, status: TransactionStatus) {
    await this.http.put<Transaction>(
      `${this.config.API_TRANSACTION_URL}/transactions/${id}`,
      { status },
    );
  }
}
