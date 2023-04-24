import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { TransactionService } from '../service/transaction.service';
import { TransactionRequest } from '../model/request/transaction-request';
import { ProducerService } from '../../core/notificator/producer/producer.service';
import { Utils } from '../../util/utils';
import { TransactionRepository } from '../repository/transaction.repository';
import { Transactions } from '../model/entity/transactions.entity';
import { Kafka, Producer } from 'kafkajs';
import { TransactionResponseData } from '../model/response/transaction-data.response';

jest.mock('../../core/notificator/producer/producer.service');


describe('TransactionService', () => {
  let service: TransactionService;
  let producerServiceMock: jest.Mocked<ProducerService>;
  let transactionRepositoryMock: jest.Mocked<TransactionRepository>;
  let kafka: Kafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: ProducerService,
          useValue: {
            __producer: jest.fn(),
          },
        },
        {
          provide: TransactionRepository,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
          },
        },
        Utils,
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    kafka = new Kafka({ brokers: ['localhost:9092'] });
    producerServiceMock = module.get<ProducerService>(ProducerService) as jest.Mocked<ProducerService>;
    transactionRepositoryMock = module.get<TransactionRepository>(
      TransactionRepository
    ) as jest.Mocked<TransactionRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction and send a notification', (done) => {
      const request: TransactionRequest = {
        transactionRequest: [
          {
            "accountExternalIdDebit": "1234",
            "accountExternalIdCredit": "4534",
            "transactionType": 1,
            "value": 150
          }
        ],
      };
      const savedTransaction: Transactions = {
        transactionId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
        accountExternalIdDebit: '1234',
        accountExternalIdCredit: '4534',
        transferTypeId: 1,
        transactionStatus: 1,
        valueTransaction: 150,
        createdAt: new Date('2023-04-24T07:16:45.927Z')
      };

      const response: TransactionResponseData[] = [
        {
            transactionExternalId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
            accountExternalIdCredit: '4534',
            accountExternalIdDebit: '1234',
            transactionType: { name: 'charge' },
            transactionStatus: { name: 'pending' },
            valueTransaction: 150,
            createdAt: new Date('2023-04-24T07:16:45.927Z')
          }
      ]
      const savedTransactionResponse: Transactions[] = [savedTransaction];
      transactionRepositoryMock.save.mockReturnValueOnce(of(savedTransactionResponse));
      const sentEvents = [{
        data: {
            transactionId: 'd343d5e0-fb81-4245-89da-d6185fc0b616',
            accountExternalIdDebit: '1234',
            accountExternalIdCredit: '4534',
            transferTypeId: 1,
            transactionStatus: 1,
            valueTransaction: 150,
            createdAt: new Date('2023-04-24T07:16:45.927Z')
          }
      }];
      const producerSpy = jest.spyOn(producerServiceMock, '__producer');
      producerSpy.mockImplementation();
      service.create(request).subscribe((result) => {
        expect(result).toEqual(response);
        expect(sentEvents).toEqual([{ data: savedTransaction }]);
        done();
      });
    });

    it('should return an error when repository.save() fails', (done) => {
      const request: TransactionRequest = {
        transactionRequest: [
          {
            "accountExternalIdDebit": "1234",
            "accountExternalIdCredit": "4534",
            "transactionType": 1,
            "value": 150
          }
        ],
      };
      const error = new Error('Error saving transaction');
      transactionRepositoryMock.save.mockReturnValueOnce(throwError(error));
      service.create(request).subscribe(
        (result) => {
          fail('Should have thrown an error');
        },
        (err) => {
          expect(err).toEqual(error);
          done();
        }
      );
    });
  });

});