import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

@Injectable()
export class AntiFraudService {
  /**
   * The function `validateTransaction` takes a transaction object as input, checks its value, and
   * updates its status accordingly.
   * @param {TransactionToUpdate} transaction - The `transaction` parameter is an object of type
   * `TransactionToUpdate`. It contains two properties: `value` and `transactionId`.
   * @returns a Promise that resolves to void.
   */
  async validateTransaction(transaction: TransactionToUpdate): Promise<void> {
    const { value, transactionId } = transaction || {};

    try {
      if (value > 1000)
        return this.requestToUpdate(transactionId, {
          status: TransactionStatus.REJECTED,
        });

      return this.requestToUpdate(transactionId, {
        status: TransactionStatus.APPROVED,
      });
    } catch (error) {
      throw new Error(`Error updating transaction`);
    }
  }

  /**
   * The function `requestToUpdate` sends a PUT request to update a transaction with the specified
   * transactionId and body, and logs the response or any errors.
   * @param {string} transactionId - A string representing the ID of the transaction that needs to be
   * updated.
   * @param body - The `body` parameter is an object that contains the `status` property. This property
   * represents the new status value that you want to update for a transaction.
   */
  async requestToUpdate(
    transactionId: string,
    body: { status: number },
  ): Promise<void> {
    const url = `${process.env.URL_API_UPDATE}/${transactionId}`;

    try {
      const response = await axios.put(url, body);

      if (response.status === HttpStatus.OK) {
        console.log('Update Request successful:', response.data);
      } else {
        console.error(
          'Error updating Transaction. status code:',
          response.status,
        );
      }
    } catch (error) {
      console.error('Error sending request:', error.message);
    }
  }
}
