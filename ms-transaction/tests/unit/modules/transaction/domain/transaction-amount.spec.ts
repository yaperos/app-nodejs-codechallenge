import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { TransactionAmount } from 'src/modules/transaction/domain/transaction-amount';

describe('TransactionAmount test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      new TransactionAmount(0);
    }).toThrow(InvalidArgumentError);
  });
});
