import { Test, TestingModule } from '@nestjs/testing';
import { ClientKafka } from '@nestjs/microservices';
import { AntifraudService } from './antifraud.service';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionStatus } from '../common/enums/transaction';


describe('AntifraudService', () => {
  let antifraudService: AntifraudService;
  let mockTransactionClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntifraudService,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    antifraudService = module.get<AntifraudService>(AntifraudService);
    mockTransactionClient = module.get<ClientKafka>('TRANSACTION_SERVICE');
  });

  it('should be defined', () => {
    expect(antifraudService).toBeDefined();
  });

  it('should approve transaction with value <= 1000', async () => {
    const transaction: TransactionDto = {
      id: 'd22ccc68-3f31-4498-a12b-63356f6960e7',
      value: 800,
      transactionStatus: 1,
    };

    await antifraudService.verifyAntifraud(transaction);

    expect(transaction.transactionStatus).toEqual(TransactionStatus.APPROVED);
    expect(mockTransactionClient.emit).toHaveBeenCalledWith(
      'transaction.update',
      JSON.stringify(transaction),
    );
  });

  it('should reject transaction with value > 1000', async () => {
    const transaction: TransactionDto = {
      id: 'd22ccc68-3f31-4498-a12b-63356f6960e7',
      value: 1200,
      transactionStatus: 1,
    };

    await antifraudService.verifyAntifraud(transaction);

    expect(transaction.transactionStatus).toEqual(TransactionStatus.REJECTED);
    expect(mockTransactionClient.emit).toHaveBeenCalledWith(
      'transaction.update',
      JSON.stringify(transaction),
    );
  });
});
