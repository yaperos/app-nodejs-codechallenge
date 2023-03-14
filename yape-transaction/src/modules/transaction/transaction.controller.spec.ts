import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionMock } from './transaction.mock.spec';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  const transactionMock = new TransactionMock();
  const updateTransactionDto = TransactionMock.updateTransactionDto;
  const createTransactionDto = TransactionMock.createTransactionDto;
  const transactionExternalId = TransactionMock.transactionExternalId;
  const pageOptionsDto = TransactionMock.pageOptionsDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: transactionMock,
        },
      ],
    }).compile();

    transactionController = module.get<TransactionController>(
      TransactionController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transactionController).toBeDefined();
  });

  it('validate create should be called createTransaction', async () => {
    const spyCreateTransaction = jest.spyOn(
      transactionMock,
      'createTransaction',
    );
    await transactionController.create(createTransactionDto);
    expect(spyCreateTransaction).toHaveBeenCalledWith(createTransactionDto);
  });

  it('validate getAllTransactions should be called getAllTransactions', async () => {
    const spyGetAllTransactions = jest.spyOn(
      transactionMock,
      'getAllTransactions',
    );
    await transactionController.getAllTransactions(pageOptionsDto);
    expect(spyGetAllTransactions).toHaveBeenCalledWith(pageOptionsDto);
  });

  it('validate findTransaction should be called findOne', async () => {
    const spyFindOne = jest.spyOn(transactionMock, 'findOne');
    await transactionController.findTransaction(transactionExternalId);
    expect(spyFindOne).toHaveBeenCalledWith(transactionExternalId);
  });

  it('validate findTransaction should be called findOne', async () => {
    const spyFindOne = jest.spyOn(transactionMock, 'findOne');
    await transactionController.findTransaction(transactionExternalId);
    expect(spyFindOne).toHaveBeenCalledWith(transactionExternalId);
  });

  it('validate approvedTransaction should be called approvedTransaction', async () => {
    const spyApprovedTransaction = jest.spyOn(
      transactionMock,
      'approvedTransaction',
    );
    await transactionController.approvedTransaction(updateTransactionDto);
    expect(spyApprovedTransaction).toHaveBeenCalledWith(updateTransactionDto);
  });

  it('validate rejectedTransaction should be called rejectedTransaction', async () => {
    const spyRejectedTransaction = jest.spyOn(
      transactionMock,
      'rejectedTransaction',
    );
    await transactionController.rejectedTransaction(updateTransactionDto);
    expect(spyRejectedTransaction).toHaveBeenCalledWith(updateTransactionDto);
  });
});
