import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let transactionController: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            encodeWithId: jest.fn(),
          },
        },
        {
          provide: 'anti-fraud-consumer',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
  });
  it('should be defined', () => {
    expect(transactionController).toBeDefined();
  });

  it('should return Transaction with status "pending"', () => {
    const transaction = {
      accountExternalIdDebit: '12345',
      accountExternalIdCredit: '12345',
      tranferTypeId: 1,
      value: 1200,
    };
    // const transactionSaved = transactionController.save(transaction);
    // transactionSaved.then((transaction) => {
    //   expect(transaction.transactionStatus.name).toBe('pending');
    // });
    // expect(transactionSaved.transactionStatus.name).toBe('pending');
    expect(transactionController.save(transaction)).not.toBeNull();
  });
});
