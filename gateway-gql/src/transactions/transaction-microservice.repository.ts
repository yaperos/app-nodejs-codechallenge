import { Injectable } from '@nestjs/common';
import * as axios from 'axios';
import { ITransaction } from './ITransaction';
import { AxiosError } from 'axios';

@Injectable()
export class TransactionMicroserviceRepository {
  SERVER_TRANSACTIONS_BASE = process.env.TRANSACTIONS_SERVER;

  async create(data: Partial<ITransaction>) {
    const url =
      'http://' + this.SERVER_TRANSACTIONS_BASE + ':3000' + '/transaction';
    console.log(url, data);

    const { data: resp } = await axios.default.post(url, data);
    return resp as ITransaction;
  }
  async get(transactionId: string): Promise<ITransaction | null> {
    try {
      const url =
        'http://' +
        this.SERVER_TRANSACTIONS_BASE +
        ':3000' +
        '/transaction/' +
        transactionId;
      console.log(url);

      const { data: resp } = await axios.default.get(url);
      return resp as ITransaction;
    } catch (e) {
      if (e instanceof AxiosError && e?.response?.status == 404) {
        return null;
      } else throw e;
    }
  }
}
