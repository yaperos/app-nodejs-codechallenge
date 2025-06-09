import CreateTransactionInput from '../../src/transaction/interface/graphql/inputs/createTransaction.input';

export function createMockTransactionInput(): CreateTransactionInput {
  const result = new CreateTransactionInput();
  result.accountExternalIdDebit = '123e4567-e89b-12d3-a456-426614174000';
  result.accountExternalIdCredit = '123e4567-e89b-12d3-a456-426614174001';
  result.transferTypeId = 1;
  result.value = 100.5;

  return result;
}
