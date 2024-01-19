import { TransactionCreator } from 'src/modules/transaction/application/use-cases/transaction-creator.use-case';

import {
  CreateTransactionInputMother,
  MockTransactionClientProvider,
  TransactionOutputMother,
} from '../../domain/providers/mock-transaction-client.provider';

describe('TransactionCreator UseCase test', () => {
  const mockTransactionClientProvider = new MockTransactionClientProvider();
  const transactionCreator = new TransactionCreator(
    mockTransactionClientProvider,
  );

  it('should create the transaction', async () => {
    const transactionOutput = TransactionOutputMother.random();
    mockTransactionClientProvider.returnOnCreate(transactionOutput);

    const transactionInput = CreateTransactionInputMother.random();
    const transactionCreated = await transactionCreator.run(transactionInput);
    expect(transactionCreated).toEqual(transactionOutput);
    mockTransactionClientProvider.assertCreateHasBeenCalledWith(
      transactionInput,
    );
  });
});
