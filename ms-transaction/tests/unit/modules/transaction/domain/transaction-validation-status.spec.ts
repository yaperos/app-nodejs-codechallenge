import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { TransactionValidationStatus } from 'src/modules/transaction/domain/transaction-validation-status';

import { WordMother } from '../../shared/domain/mothers';

describe('TransactionValidationStatus test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      TransactionValidationStatus.fromValue(WordMother.random());
    }).toThrow(InvalidArgumentError);
  });
});
