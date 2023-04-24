import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolve } from '../transaction/transaction.resolver';
import { TransactionService } from '../../transaction/service/transaction.service';
import { TransactionRequest } from '../../transaction/model/request/transaction-request';
import { TransactionResponseData } from '../../transaction/model/response/transaction-data.response';

describe('TransactionResolve', () => {
  let resolver: TransactionResolve;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolve,
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn().mockResolvedValue([
                {
                  transactionExternalId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
                  accountExternalIdDebit: '1234',
                  accountExternalIdCredit: '4534',
                  transactionType: {
                    name: 'charge'
                  },
                  transactionStatus: {
                    name: 'pending'
                  },
                  valueTransaction: 150,
                  createdAt: new Date('2023-04-24T07:16:45.927Z')
                }
              ]),
            get: jest.fn().mockResolvedValue([
                {
                    transactionExternalId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
                    accountExternalIdDebit: '1234',
                    accountExternalIdCredit: '4534',
                    transactionType: {
                      name: 'charge'
                    },
                    transactionStatus: {
                      name: 'pending'
                    },
                    valueTransaction: 150,
                    createdAt: new Date('2023-04-24T07:16:45.927Z')
                  }
            ]),
            getById: jest.fn().mockResolvedValue({
                transactionExternalId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
                accountExternalIdDebit: '1234',
                accountExternalIdCredit: '4534',
                transactionType: {
                  name: 'charge'
                },
                transactionStatus: {
                  name: 'pending'
                },
                valueTransaction: 150,
                createdAt: new Date('2023-04-24T07:16:45.927Z')
              }),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolve>(TransactionResolve);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('transaction', () => {
    it('should create a transaction and return the expected data', async () => {
      const request: TransactionRequest =  
        {    
            transactionRequest:[
                {
                    "accountExternalIdDebit": "1234",
                    "accountExternalIdCredit": "4534",
                    "transactionType": 1,
                    "value": 150
                }
            ] 
        };
    
      const expectedResult: TransactionResponseData[] = [
        {
          transactionExternalId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
          accountExternalIdDebit: '1234',
          accountExternalIdCredit: '4534',
          transactionType: {
            name: 'charge'
          },
          transactionStatus: {
            name: 'pending'
          },
          valueTransaction: 150,
          createdAt: new Date('2023-04-24T07:16:45.927Z')
        }
      ];
      
      const result = await resolver.transaction(request);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTransactions', () => {
    it('should call transactionService.get', async () => {
        const expectedResult: TransactionResponseData[] = [
            {
              transactionExternalId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
              accountExternalIdDebit: '1234',
              accountExternalIdCredit: '4534',
              transactionType: {
                name: 'charge'
              },
              transactionStatus: {
                name: 'pending'
              },
              valueTransaction: 150,
              createdAt: new Date('2023-04-24T07:16:45.927Z')
            }
        ];

      const result = await resolver.getTransactions();

      expect(result).toEqual(expectedResult);
      expect(transactionService.get).toHaveBeenCalled();
    });
  });

  describe('getTransactionsById', () => {
    it('should call transactionService.getById with the provided ID', async () => {
      const id = 'test-id';
      const expectedResult = {
        transactionExternalId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
        accountExternalIdDebit: '1234',
        accountExternalIdCredit: '4534',
        transactionType: {
          name: 'charge'
        },
        transactionStatus: {
          name: 'pending'
        },
        valueTransaction: 150,
        createdAt: new Date('2023-04-24T07:16:45.927Z')
      };

      const result = await resolver.getTransactionsById(id);

      expect(result).toEqual(expectedResult);
      expect(transactionService.getById).toHaveBeenCalledWith(id);
    });
  });
});