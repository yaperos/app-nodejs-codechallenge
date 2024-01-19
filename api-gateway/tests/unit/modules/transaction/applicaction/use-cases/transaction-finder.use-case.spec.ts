import { TransactionFinder } from 'src/modules/transaction/application/use-cases/transaction-finder.use-case';
import { UuidMother } from 'tests/unit/modules/shared/domain/mothers';

import {
  MockTransactionClientProvider,
  TransactionOutputMother,
} from '../../domain/providers/mock-transaction-client.provider';

describe('TransactionFinder UseCase test', () => {
  const mockTransactionClientProvider = new MockTransactionClientProvider();
  const transactionFinder = new TransactionFinder(
    mockTransactionClientProvider,
  );

  it('should find the transaction', async () => {
    const transactionOutput = TransactionOutputMother.random();
    mockTransactionClientProvider.returnOnFindOne(transactionOutput);

    const transactionId = UuidMother.random();
    const transaction = await transactionFinder.run(transactionId);
    expect(transaction).toEqual(transactionOutput);
    mockTransactionClientProvider.assertFindOneHasBeenCalledWith(transactionId);
  });
});
