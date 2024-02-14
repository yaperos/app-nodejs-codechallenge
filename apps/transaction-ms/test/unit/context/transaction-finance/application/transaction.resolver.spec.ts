import { TestBed } from '@automock/jest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TransactionResolver } from '../../../../../src/contexts/transaction-finance/application/transaction.resolver';

describe('Transaction Resolver Unit Test', () => {
  let transactionResolver: TransactionResolver;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(TransactionResolver).compile();
    transactionResolver = unit;
    commandBus = unitRef.get(CommandBus);
    queryBus = unitRef.get(QueryBus);
  });

  test('should be defined', async () => {
    expect(transactionResolver).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should make a new transaction', async () => {
      await commandBus.execute.mockResolvedValue(() => ({
        transactionExternalId: '02361f1f-0c83-4e56-becc-5ba51aff1eb8',
        accountExternalIdDebit: '9b568468-1772-45b5-96e8-ce25b2974aa5',
        accountExternalIdCredit: '6fec524b-b982-450e-931d-eb005f37c976',
        transactionStatus: 1,
        transactionType: 1,
        value: 1000,
        createdAt: '2024-02-14T15:35:29.385Z',
        updatedAt: '2024-02-14T15:35:29.385Z',
      }));

      const result = await transactionResolver.createTransaction({
        accountExternalIdDebit: '9b568468-1772-45b5-96e8-ce25b2974aa5',
        accountExternalIdCredit: '6fec524b-b982-450e-931d-eb005f37c976',
        typeId: 1,
        value: 1000,
      });

      expect(result()).toEqual({
        transactionExternalId: '02361f1f-0c83-4e56-becc-5ba51aff1eb8',
        accountExternalIdDebit: '9b568468-1772-45b5-96e8-ce25b2974aa5',
        accountExternalIdCredit: '6fec524b-b982-450e-931d-eb005f37c976',
        transactionStatus: 1,
        transactionType: 1,
        value: 1000,
        createdAt: '2024-02-14T15:35:29.385Z',
        updatedAt: '2024-02-14T15:35:29.385Z',
      });
    });
  });
  describe('findOne', () => {
    it('should get one transaction', async () => {
      await queryBus.execute.mockResolvedValue(() => ({
        transactionExternalId: '02361f1f-0c83-4e56-becc-5ba51aff1eb8',
        accountExternalIdDebit: '9b568468-1772-45b5-96e8-ce25b2974aa5',
        accountExternalIdCredit: '6fec524b-b982-450e-931d-eb005f37c976',
        transactionStatus: 1,
        transactionType: 1,
        value: 1000,
        createdAt: '2024-02-14T15:35:29.385Z',
        updatedAt: '2024-02-14T15:35:29.385Z',
      }));

      const result = await transactionResolver.findOne({
        transactionId: '02361f1f-0c83-4e56-becc-5ba51aff1eb8',
      });

      expect(result()).toEqual({
        transactionExternalId: '02361f1f-0c83-4e56-becc-5ba51aff1eb8',
        accountExternalIdDebit: '9b568468-1772-45b5-96e8-ce25b2974aa5',
        accountExternalIdCredit: '6fec524b-b982-450e-931d-eb005f37c976',
        transactionStatus: 1,
        transactionType: 1,
        value: 1000,
        createdAt: '2024-02-14T15:35:29.385Z',
        updatedAt: '2024-02-14T15:35:29.385Z',
      });
    });
  });
});
