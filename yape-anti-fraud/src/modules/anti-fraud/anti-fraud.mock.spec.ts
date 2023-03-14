import { ValidateTransactionDto } from '@core/config/types';

export class AntiFraudMock {
  static readonly kafkaNameTransaction = 'TRANSACTION_SERVICE';
  send = jest.fn().mockReturnThis();
  emit = jest.fn().mockReturnThis();
  subscribe = jest.fn().mockReturnThis();
  validateAmountValue = jest.fn().mockReturnThis();
  validateTransaction = jest.fn().mockReturnThis();

  static readonly validateTransactionDto: ValidateTransactionDto = {
    id: 1,
    accountExternalIdDebit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    accountExternalIdCredit: 'e7991681-16bd-4a57-b112-a96796ba4a21',
    transactionExternalId: 'f7551681-56bd-fd57-a234-m96796ha4a21',
    tranferTypeId: 1,
    value: 55,
  };
}
