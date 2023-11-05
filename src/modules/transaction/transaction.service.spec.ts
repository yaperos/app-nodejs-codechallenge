import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionEntity } from './entities/transaction.entity';
import { StatusTransactions } from './enums/status.enum';
import { expectEnum } from './helper/expect-enum';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: Repository<TransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useClass: Repository,
        },
        TransactionRepository,
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
  });

  const payload: CreateTransactionDto[] = [
    {
      accountExternalIdDebit: 'd55f87af-adb2-4c03-9ea5-357d8b7095a8',
      accountExternalIdCredit: 'e388b1be-4d7e-48d1-ba52-9ed52af663a8',
      tranferTypeId: 1,
      value: 1200,
    },
    {
      accountExternalIdDebit: '0e14f126-a244-46df-b74e-030c77adce97',
      accountExternalIdCredit: '2a9c58af-db48-4609-8c37-13a6df623c6e',
      tranferTypeId: 1,
      value: 800,
    },
  ];

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create transaction method', async () => {
    const mockResponse: any = payload.map((transaction, index) => ({
      id: `transaction-id-${index}`,
      ...transaction,
      status: StatusTransactions.Pending,
    }));

    const insertMock = jest.fn();
    const findMock = jest.fn();

    repository.insert = insertMock;
    repository.find = findMock;

    jest.spyOn(repository, 'insert').mockReturnValue(mockResponse);
    jest.spyOn(repository, 'find').mockReturnValue(mockResponse);
    const result = await service.createTransanction(payload);

    expect(insertMock).toHaveBeenCalled();
    expect(findMock).toHaveBeenCalled();
    expect({ type: result[0].status }).toMatchObject({
      type: expectEnum(StatusTransactions),
    });
    expect(result).toEqual(mockResponse);
  });

  it('Update transaction status Rejected', async () => {
    const mockResponse: any = {
      id: 'e53689b4-b3a9-44f9-9b7e-71483a0368de',
      accountExternalIdDebit: 'd55f87af-adb2-4c03-9ea5-357d8b7095a8',
      accountExternalIdCredit: 'e388b1be-4d7e-48d1-ba52-9ed52af663a8',
      tranferTypeId: 1,
      value: 1200,
      status: 'Pending',
    };

    const updateMock = jest.fn();
    const findByIdMock = jest.fn();

    repository.update = updateMock;
    repository.findOne = findByIdMock;

    jest.spyOn(repository, 'update').mockReturnValue(mockResponse);
    jest.spyOn(repository, 'findOne').mockReturnValue(mockResponse);

    const result = await service.updateTransaction([mockResponse]);
    expect(updateMock).toHaveBeenCalled();
    expect(findByIdMock).toHaveBeenCalled();

    expect({ type: result[0].status }).toMatchObject({
      type: expectEnum(StatusTransactions),
    });
    expect(result[0].status).toBe(StatusTransactions.Rejected);
  });

  it('Update transaction status Approved', async () => {
    const mockResponse: any = {
      id: 'a7de605b-e3c4-431d-afba-1b6b5fcd3b6c',
      accountExternalIdDebit: '0e14f126-a244-46df-b74e-030c77aded99',
      accountExternalIdCredit: '2a9c58af-db48-4609-8c37-13a6df623c6e',
      tranferTypeId: 1,
      value: 720,
      status: 'Pending',
    };

    const updateMock = jest.fn();
    const findByIdMock = jest.fn();

    repository.update = updateMock;
    repository.findOne = findByIdMock;

    jest.spyOn(repository, 'update').mockReturnValue(mockResponse);
    jest.spyOn(repository, 'findOne').mockReturnValue(mockResponse);

    const result = await service.updateTransaction([mockResponse]);
    expect(updateMock).toHaveBeenCalled();
    expect(findByIdMock).toHaveBeenCalled();

    expect({ type: result[0].status }).toMatchObject({
      type: expectEnum(StatusTransactions),
    });
    expect(result[0].status).toBe(StatusTransactions.Approved);
  });
});
