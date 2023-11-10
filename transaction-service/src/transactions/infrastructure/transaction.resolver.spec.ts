import { TransactionsResolver } from './transactions.resolver';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { RetrieveTransaction } from '../domain/transaction.entity';

class MockTransactionsService {
  retrieveTransaction = jest.fn();
  retrieveAll = jest.fn();
  transaction = jest.fn();
}

describe('TransactionsResolver', () => {
  let resolver: TransactionsResolver;
  let transactionsService: MockTransactionsService;

  beforeEach(() => {
    transactionsService = new MockTransactionsService();
    resolver = new TransactionsResolver(transactionsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('retrieveTransaction', () => {
    it('should return a transaction by external id', async () => {
      const expectedTransaction: RetrieveTransaction = {
        transactionExternalId: '',
        transactionType: {
          id: '',
          name: ''
        },
        transactionStatus: {
          id:'',
          name: ''
        },
        value: 0,
        createdAt: undefined
      }
      transactionsService.retrieveTransaction.mockResolvedValue(expectedTransaction);

      const result = await resolver.retrieveTransaction('someId');

      expect(result).toEqual(expectedTransaction);
      expect(transactionsService.retrieveTransaction).toHaveBeenCalledWith('someId');
    });
  });

  describe('retrieveTransactionAll', () => {
    it('should return all transactions', async () => {
      const expectedTransactions: RetrieveTransaction[] = [
       {
          transactionExternalId: '',
          transactionType: {
            id: '',
            name: ''
          },
          transactionStatus: {
            id:'',
            name: ''
          },
          value: 0,
          createdAt: undefined
        }
      ]
      transactionsService.retrieveAll.mockResolvedValue(expectedTransactions);

      const result = await resolver.retrieveTransactionAll();

      expect(result).toEqual(expectedTransactions);
      expect(transactionsService.retrieveAll).toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const inputData: CreateTransactionInput = {
        accountExternalIdDebit: '',
        accountExternalIdCredit: '',
        tranferTypeId: 0,
        value: 0
      }
      const expectedTransaction: RetrieveTransaction = {
        transactionExternalId: '',
        transactionType: {
          id: '',
          name: ''
        },
        transactionStatus: {
          id:'',
          name: ''
        },
        value: 0,
        createdAt: undefined
      }
      transactionsService.transaction.mockResolvedValue(expectedTransaction);

      const result = await resolver.createTransaction(inputData);

      expect(result).toEqual(expectedTransaction);
      expect(transactionsService.transaction).toHaveBeenCalledWith(inputData);
    });
  });
});
