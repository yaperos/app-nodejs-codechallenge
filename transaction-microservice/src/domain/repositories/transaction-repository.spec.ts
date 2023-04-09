import { Test } from '@nestjs/testing';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { TransactionRepository } from './transaction-repository';
import { faker } from '@faker-js/faker';
import { AccountTypeEnum } from '../enums/account-type.enum';
import { TransactionStatusEnum } from '../enums/transaction-status.enum';
import { Prisma } from '@prisma/client';
import { TransactionFactory } from '../factories/transaction.factory';

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository;

  let transactionFactory: TransactionFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [TransactionRepository, PrismaService, TransactionFactory],
    }).compile();

    transactionRepository = module.get(TransactionRepository);
    transactionFactory = module.get(TransactionFactory);
  });

  it('should be defined', () => {
    expect(transactionRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const input = {
        externalId: faker.datatype.uuid(),
        accountType: AccountTypeEnum.CREDIT,
        transferTypeId: faker.datatype.number({ max: 100 }),
        value: faker.datatype.float(),
        status: TransactionStatusEnum.PENDING,
      };

      const result = await transactionRepository.create(input);

      expect(result).toMatchObject({
        ...input,
        uuid: expect.any(String),
        value: new Prisma.Decimal(input.value),
      });
    });
  });

  describe('update', () => {
    it('should update a transaction', async () => {
      const createdTransaction = await transactionFactory.make();

      const input = {
        uuid: createdTransaction.uuid,
        externalId: faker.datatype.uuid(),
        accountType: AccountTypeEnum.CREDIT,
        transferTypeId: faker.datatype.number({ max: 100 }),
        value: faker.datatype.float(),
        status: TransactionStatusEnum.APPROVED,
      };

      const result = await transactionRepository.update(input);

      expect(result).toMatchObject({
        ...input,
        value: new Prisma.Decimal(input.value),
      });
    });
  });
});
