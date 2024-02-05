import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';

import { Transaction, TransactionProps } from '../domain/transaction';
import { TransactionDoc } from './entities/transaction-doc.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionInfrastructure } from './transaction.infrastructure';

describe('TransactionInfrastructure', () => {
  let service: TransactionInfrastructure;
  let repository: Repository<TransactionEntity>;
  let repository_doc: Repository<TransactionDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionInfrastructure,
        { provide: 'TRANSACTION_REPOSITORY', useClass: Repository },
        { provide: 'TRANSACTION_DOC_REPOSITORY', useClass: Repository },
      ],
    }).compile();

    service = module.get<TransactionInfrastructure>(TransactionInfrastructure);
    repository = module.get<Repository<TransactionEntity>>(
      'TRANSACTION_REPOSITORY',
    );
    repository_doc = module.get<Repository<TransactionDoc>>(
      'TRANSACTION_DOC_REPOSITORY',
    );
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

    const savedTransaction = new TransactionEntity();
    savedTransaction.transactionId = props.transactionId;
    savedTransaction.accountExternalIdCredit = props.accountExternalIdCredit;
    savedTransaction.accountExternalIdDebit = props.accountExternalIdDebit;
    savedTransaction.transferTypeId = props.transferTypeId;
    savedTransaction.value = props.value;
    savedTransaction.status = 'PENDING';
    savedTransaction.createdAt = new Date();

    jest.spyOn(repository, 'save').mockResolvedValue(savedTransaction);
    const valueReturned = await service.save(transaction);
    expect(valueReturned.properties.transactionId).toEqual(props.transactionId);
    expect(valueReturned.properties.accountExternalIdCredit).toEqual(
      props.accountExternalIdCredit,
    );
    expect(valueReturned.properties.accountExternalIdDebit).toEqual(
      props.accountExternalIdDebit,
    );
    expect(valueReturned.properties.transferTypeId).toEqual(
      props.transferTypeId,
    );
    expect(valueReturned.properties.value).toEqual(props.value);
    expect(valueReturned.properties.status).toEqual('PENDING');
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
    const transaction = new Transaction(props);

    const entity = new TransactionEntity();
    entity.transactionId = props.transactionId;
    entity.accountExternalIdCredit = props.accountExternalIdCredit;
    entity.accountExternalIdDebit = props.accountExternalIdDebit;
    entity.transferTypeId = props.transferTypeId;
    entity.value = props.value;
    entity.status = 'PENDING';
    entity.createdAt = new Date();

    jest.spyOn(repository, 'findOne').mockResolvedValue(entity);
    const valueReturned = await service.getById(transactionId);
    expect(valueReturned.properties.transactionId).toEqual(transactionId);
    expect(valueReturned.properties.accountExternalIdCredit).toEqual(
      props.accountExternalIdCredit,
    );
    expect(valueReturned.properties.accountExternalIdDebit).toEqual(
      props.accountExternalIdDebit,
    );
  });

  it('should save a transaction doc', async () => {
    const props: TransactionProps = {
      transactionId: '95d3e58e-5565-4012-bce5-2ece1c92b1ff',
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
    transactionDoc.id = new ObjectId();

    jest.spyOn(repository_doc, 'save').mockResolvedValue(transactionDoc);

    await service.save_doc(transactionDoc);

    expect(repository_doc.save).toHaveBeenCalledWith(transactionDoc);
  });

  it('should get a transaction doc by id', async () => {
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
    transactionDoc.id = new ObjectId();

    jest.spyOn(repository_doc, 'findOne').mockResolvedValue(transactionDoc);

    expect(await service.getByIdDoc(transactionId)).toEqual(transactionDoc);
  });
});
