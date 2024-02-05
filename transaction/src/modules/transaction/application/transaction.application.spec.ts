import { EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';

import { TransactionRepository } from '../domain/repositories/transaction.repository';
import {
  Transaction,
  TransactionProps,
  TStatusTransaction,
} from '../domain/transaction';
import { TransactionDoc } from '../infrastructure/entities/transaction-doc.entity';
import { TransactionInfrastructure } from '../infrastructure/transaction.infrastructure';
import {
  TransactionCreated,
  TransactionCreatedResponse,
} from './dtos/transaction-created.dto';
import { TransactionApplication } from './transaction.application';

describe('TransactionApplication', () => {
  let service: TransactionApplication;
  let repository: TransactionRepository;
  let publisher: EventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionApplication,
        {
          provide: TransactionInfrastructure,
          useValue: {
            save: () => {},
            getByIdDoc: () => {},
            getById: () => {},
            save_doc: () => {},
          },
        },
        { provide: EventPublisher, useValue: { mergeObjectContext: () => {} } },
      ],
    }).compile();

    service = module.get<TransactionApplication>(TransactionApplication);
    repository = module.get<TransactionRepository>(TransactionInfrastructure);
    publisher = module.get<EventPublisher>(EventPublisher);
  });

  it('should save a transaction', async () => {
    const props: TransactionProps = {
      transactionId: '95d3e58e-5565-4012-bce5-2ece1c92b1ff',
      accountExternalIdCredit: 'e9db395e-b014-47ba-9d8f-6c6f5ccc4c3d',
      accountExternalIdDebit: '50b63370-c95b-4cee-917b-36e06e0ec88a',
      transferTypeId: 1,
      value: 900,
    };
    const transaction = new Transaction(props);
    jest.spyOn(transaction, 'commit').mockReturnValue();

    const transactionCreated = new TransactionCreatedResponse();
    transactionCreated.transactionId = props.transactionId;
    transactionCreated.status = 'PENDING' as TStatusTransaction;

    (TransactionCreated as unknown as jest.Mock) = jest.fn();
    TransactionCreated.fromDomainToResponse = jest
      .fn()
      .mockReturnValue(transactionCreated);

    jest.spyOn(repository, 'save').mockResolvedValue(transaction);
    jest.spyOn(publisher, 'mergeObjectContext').mockReturnValue(transaction);

    expect(await service.save(transaction)).toEqual(transactionCreated);
  });

  it('should get a transaction by id', async () => {
    const transactionId = '95d3e58e-5565-4012-bce5-2ece1c92b1ff';
    const props: TransactionProps = {
      transactionId,
      accountExternalIdCredit: 'e9db395e-b014-47ba-9d8f-6c6f5ccc4c3d',
      accountExternalIdDebit: '50b63370-c95b-4cee-917b-36e06e0ec88a',
      transferTypeId: 1,
      value: 900,
    };

    const transactionDoc: TransactionDoc = new TransactionDoc();
    transactionDoc.transactionStatus = { name: 'PENDING' };
    transactionDoc.transactionType = { name: 'TRANSFER' };
    transactionDoc.value = props.value;
    transactionDoc.createdAt = new Date();
    transactionDoc.transactionId = props.transactionId;
    transactionDoc.id = new mongoose.Types.ObjectId();

    jest.spyOn(repository, 'getByIdDoc').mockResolvedValue(transactionDoc);
    const valueReturned = await service.getByIdDoc(transactionId);
    expect(valueReturned).toEqual(transactionDoc);
    expect(valueReturned.transactionId).toEqual(transactionId);
    expect(valueReturned.transactionStatus.name).toEqual('PENDING');
    expect(valueReturned.transactionType.name).toEqual('TRANSFER');
  });

  it('should update a transaction', async () => {
    const transactionId = '95d3e58e-5565-4012-bce5-2ece1c92b1ff';
    const status: TStatusTransaction = 'APPROVED' as TStatusTransaction;
    const props: TransactionProps = {
      transactionId,
      accountExternalIdCredit: 'e9db395e-b014-47ba-9d8f-6c6f5ccc4c3d',
      accountExternalIdDebit: '50b63370-c95b-4cee-917b-36e06e0ec88a',
      transferTypeId: 1,
      value: 900,
    };
    const transaction = new Transaction(props);
    transaction.update(status);

    const transactionDoc: TransactionDoc = new TransactionDoc();
    transactionDoc.transactionStatus = { name: status };
    transactionDoc.transactionType = { name: 'TRANSFER' };
    transactionDoc.value = props.value;
    transactionDoc.createdAt = new Date();
    transactionDoc.transactionId = props.transactionId;
    transactionDoc.id = new mongoose.Types.ObjectId();

    jest.spyOn(repository, 'getById').mockResolvedValue(transaction);
    jest.spyOn(repository, 'getByIdDoc').mockResolvedValue(transactionDoc);
    jest.spyOn(repository, 'save').mockResolvedValue(transaction);
    jest.spyOn(repository, 'save_doc').mockResolvedValue(transactionDoc);

    await service.update(transactionId, status);

    expect(repository.save).toHaveBeenCalledWith(transaction);
    expect(repository.save_doc).toHaveBeenCalledWith(transactionDoc);
  });
});
