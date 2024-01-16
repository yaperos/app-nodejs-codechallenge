import axios, { AxiosResponse } from 'axios';
import { Logger } from '../Logger';

interface TransactionResponse {}

export class UpdateTransaction {
  private uuid: string;
  private status: string;
  private logger : Logger;

  constructor(uuid: string, status: string) {
    this.uuid = uuid;
    this.status = status;
    this.logger = new Logger();
  }

  public async sendUpdate(): Promise<AxiosResponse<TransactionResponse> | null> {
    const payload = {
      uuid: this.uuid,
      status: this.status,
    };

    try {
      const response = await axios.put<TransactionResponse>('http://localhost:4001/transaction/', payload);
      this.logger.debug('Transaction updated successfully');
      return response;
    } catch (error) {
        this.logger.error('Error updating transaction:' + error);
      return null;
    }
  }
}

