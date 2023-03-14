import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { of } from 'rxjs';
import { TransactionsService } from './transactions.service';
import { TransactionsMock } from './transactions.mock.spec';
import { environment } from '@core/config/environment';
import {
  ServerError,
  StatusResponse,
  TransactionPattern,
} from '@core/config/constants';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  const transactionsMock = new TransactionsMock();
  const transactionDataResponse = TransactionsMock.transactionDataResponse;
  const createTransactionDto = TransactionsMock.createTransactionDto;
  const transactionExternalId = TransactionsMock.transactionExternalId;
  const listTransaction = TransactionsMock.listTransaction;
  const pageOptionsDto = TransactionsMock.pageOptionsDto;
  const paginationTransaction = TransactionsMock.paginationTransaction;

  beforeEach(async () => {
    environment.kafkaConfig.name = TransactionsMock.kafkaNameTransaction;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsMock.kafkaNameTransaction,
          useValue: transactionsMock,
        },
      ],
    }).compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transactionsService).toBeDefined();
  });

  it('createTransaction should return OK', async () => {
    const createTransactionDtoString = JSON.stringify(createTransactionDto);
    const spySend = jest
      .spyOn(transactionsMock, 'send')
      .mockReturnValueOnce(of(transactionDataResponse));
    const { status, data } = await transactionsService.createTransaction(
      createTransactionDto,
    );
    expect(spySend).toHaveBeenCalledWith(
      TransactionPattern.CREATE_TRANSACTION,
      createTransactionDtoString,
    );
    expect(data).toBeDefined();
    expect(status).toEqual(StatusResponse.OK);
  });

  it('createTransaction should return ERROR', async () => {
    const spySend = jest
      .spyOn(transactionsMock, 'send')
      .mockImplementationOnce(() => {
        return new Error();
      });

    await expect(
      transactionsService.createTransaction(createTransactionDto),
    ).rejects.toThrowError(
      new InternalServerErrorException(ServerError.INTERNAL_SERVER_ERROR),
    );

    expect(spySend).toHaveBeenCalled();
  });

  it('getTransactionById should return transaction', async () => {
    const spySend = jest
      .spyOn(transactionsMock, 'send')
      .mockReturnValueOnce(of(transactionDataResponse));
    const { status, data } = await transactionsService.getTransactionById(
      transactionExternalId,
    );

    expect(spySend).toHaveBeenCalledWith(
      TransactionPattern.FIND_ONE_TRANSACTION,
      transactionExternalId,
    );
    expect(data).toBeDefined();
    expect(status).toEqual(StatusResponse.OK);
  });

  it('getTransactionById should return ERROR', async () => {
    const spySend = jest
      .spyOn(transactionsMock, 'send')
      .mockImplementationOnce(() => {
        return new Error();
      });

    await expect(
      transactionsService.getTransactionById(transactionExternalId),
    ).rejects.toThrowError(
      new InternalServerErrorException(ServerError.INTERNAL_SERVER_ERROR),
    );

    expect(spySend).toHaveBeenCalled();
  });

  it('getTransactions should return list of transactions', async () => {
    const spySend = jest
      .spyOn(transactionsMock, 'send')
      .mockReturnValueOnce(of(paginationTransaction));

    const { data, status } = await transactionsService.getTransactions(
      pageOptionsDto,
    );

    expect(spySend).toHaveBeenCalledWith(
      TransactionPattern.LIST_TRANSACTION,
      JSON.stringify({ ...pageOptionsDto, skip: pageOptionsDto.skip }),
    );
    expect(data).toBeDefined();
    expect(data).toEqual(listTransaction);
    expect(status).toEqual(StatusResponse.OK);
  });

  it('getTransactions should return ERROR', async () => {
    const spySend = jest
      .spyOn(transactionsMock, 'send')
      .mockImplementationOnce(() => {
        return new Error();
      });

    await expect(
      transactionsService.getTransactions(pageOptionsDto),
    ).rejects.toThrowError(
      new InternalServerErrorException(ServerError.INTERNAL_SERVER_ERROR),
    );

    expect(spySend).toHaveBeenCalled();
  });

  it('onModuleInit should subscribe response', async () => {
    const spySubscribeToResponseOf = jest.spyOn(
      transactionsMock,
      'subscribeToResponseOf',
    );
    transactionsService.onModuleInit();
    expect(spySubscribeToResponseOf).toHaveBeenNthCalledWith(
      1,
      TransactionPattern.CREATE_TRANSACTION,
    );
    expect(spySubscribeToResponseOf).toHaveBeenNthCalledWith(
      2,
      TransactionPattern.LIST_TRANSACTION,
    );
    expect(spySubscribeToResponseOf).toHaveBeenNthCalledWith(
      3,
      TransactionPattern.FIND_ONE_TRANSACTION,
    );
  });
});
