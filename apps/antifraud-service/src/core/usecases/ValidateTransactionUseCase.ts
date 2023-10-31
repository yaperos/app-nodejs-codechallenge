import {
  EventEmitter,
  ValidateTransactionUseCaseInput,
  ValidateTransactionUseCaseOutput,
} from '../domain';

export type ValidateTransactionUseCaseParams = {
  eventEmitter: EventEmitter;
  transactionValueLimit: number;
};

export class ValidateTransactionUseCase {
  private readonly eventEmitter: EventEmitter;
  private readonly transactionValueLimit: number;

  constructor({
    eventEmitter,
    transactionValueLimit,
  }: ValidateTransactionUseCaseParams) {
    this.eventEmitter = eventEmitter;
    this.transactionValueLimit = transactionValueLimit;
  }

  private validate(port: ValidateTransactionUseCaseInput): void {
    if (!port?.transaction?.id) {
      throw new Error('TRANSACTION_ID_NOT_DEFINED');
    }
  }

  private validateTransaction({
    transaction,
  }: ValidateTransactionUseCaseInput) {
    if (transaction.value <= this.transactionValueLimit) {
      this.eventEmitter.sendApprovedTransactionEvent(transaction);
      return;
    }

    this.eventEmitter.sendRejectedTransactionEvent(
      transaction,
      'VALUE_LIMIT_EXCEEDED',
    );
  }

  async execute(
    port: ValidateTransactionUseCaseInput,
  ): Promise<ValidateTransactionUseCaseOutput> {
    this.validate(port);

    this.validateTransaction(port);

    return {
      success: true,
    };
  }
}
