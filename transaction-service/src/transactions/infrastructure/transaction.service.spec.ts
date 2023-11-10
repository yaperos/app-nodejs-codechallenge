import { TransactionsService } from './transactions.service';
import { IProducerService } from '../domain/producer.interface';
import { RetrieveTransaction } from '../domain/transaction.entity';
import { ITransactionsRepository } from '../domain/repository.interface';
import { CreateTransactionInput } from './dto/create-transaction.input';

class MockProducerService implements IProducerService {
  async produce(topic: string, message: any): Promise<void> {
     Promise.resolve(true)
  }
}

const mockRepository: ITransactionsRepository = {
  retrieve: jest.fn(), 
  retrieveAll: jest.fn(), 
  transaction: jest.fn(), 
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let producerService: MockProducerService;

  beforeEach(async () => {
    producerService = new MockProducerService()
    
    service = new TransactionsService(producerService, mockRepository)
 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve a transaction', async () => {
    const transactionId = 'someId';
    const expectedTransaction: RetrieveTransaction = {
      transactionExternalId: '',
      transactionType: {
        id: '',
        name: ''
      },
      transactionStatus:  {
        id: '',
        name: ''
      },
      value: 0,
      createdAt: undefined
    }; 

    jest.spyOn(mockRepository, 'retrieve').mockResolvedValue(expectedTransaction);

    const result = await service.retrieveTransaction(transactionId);

    expect(result).toEqual(expectedTransaction);
  });

  it('should retrieve all transactions', async () => {
    const expectedTransactions: RetrieveTransaction[] = [];

    jest.spyOn(mockRepository, 'retrieveAll').mockResolvedValue(expectedTransactions);

    const result = await service.retrieveAll();

    expect(result).toEqual(expectedTransactions);
  });

  it('should create a new transaction', async () => {
    const inputData: CreateTransactionInput = {
      accountExternalIdDebit: '',
      accountExternalIdCredit: '',
      tranferTypeId: 0,
      value: 10
    };

    const expectedTransaction: RetrieveTransaction = {
      transactionExternalId: '',
      transactionType: {
        id: '',
        name: ''
      },
      transactionStatus: {
        id: '',
        name: ''
      },
      value: 0,
      createdAt:new Date()
    };

    jest.spyOn(mockRepository, 'transaction').mockResolvedValue(expectedTransaction);

    const result = await service.transaction(inputData);

    expect(result).toEqual(expectedTransaction);
  });

  it('should throw an error for invalid transaction value', async () => {
    const inputData :CreateTransactionInput = {
      value: 0,
      accountExternalIdDebit: '',
      accountExternalIdCredit: '',
      tranferTypeId: 0
    };

    await expect(service.transaction(inputData)).rejects.toThrow('Transaction rejected');
  });


});
