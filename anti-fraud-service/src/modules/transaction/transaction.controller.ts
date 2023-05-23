import { injectable } from 'inversify';
import { ITransaction } from './transaction.interface';
import { TransactionService } from './transaction.service';

/**
 * Controller used to handle Transaction related requests
 */
@injectable()
class TransactionController {
  /** Transaction service instance */
  private readonly _service: TransactionService;

  /**
   * @param {TransactionService} service Transaction service
   */
  constructor(service: TransactionService) {
    this._service = service;
  }

  /**
   *  Handle an incoming validation request from an event streamer
   * @param {string} message Message received from event streamer
   */
  handleTransactionValidation = async (message: string) => {
    // Parse message to get Transaction data
    const transactionData: ITransaction = JSON.parse(message);

    // Validate the Transaction
    await this._service.validate(transactionData);
  };
}

export { TransactionController };
