import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService, TransactionsController } from '.';
import { TransactionsMock } from './transactions.mock.spec';

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  const transactionsMock = new TransactionsMock();
  const createTransactionDto = TransactionsMock.createTransactionDto;
  const getOneTransactionParam = TransactionsMock.getOneTransactionParam;
  const pageOptionsDto = TransactionsMock.pageOptionsDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: transactionsMock,
        },
      ],
    }).compile();

    transactionsController = module.get<TransactionsController>(
      TransactionsController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transactionsController).toBeDefined();
  });

  it('createTransaction should be call a service create', async () => {
    const spyCreateTransaction = jest.spyOn(
      transactionsMock,
      'createTransaction',
    );
    await transactionsController.createTransaction(createTransactionDto);
    expect(spyCreateTransaction).toHaveBeenCalled();
  });

  it('listTransaction should be call a get transaction', async () => {
    const spyGetTransactions = jest.spyOn(transactionsMock, 'getTransactions');
    await transactionsController.listTransaction(pageOptionsDto);
    expect(spyGetTransactions).toHaveBeenCalledWith(pageOptionsDto);
  });

  it('getTransactionById should be call getTransactionById', async () => {
    const spyGetTransactionById = jest.spyOn(
      transactionsMock,
      'getTransactionById',
    );
    await transactionsController.getTransactionById(getOneTransactionParam);
    expect(spyGetTransactionById).toHaveBeenCalled();
  });
});
