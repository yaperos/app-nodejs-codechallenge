import { Test } from '@nestjs/testing';
import { ClientKafka } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionRepository } from '../domain/repositories/transaction-repository';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { AccountTypeEnum } from '../domain/enums/account-type.enum';
import { Prisma } from '@prisma/client';

describe('AppService', () => {
  let appService: AppService;
  let clientKafka: ClientKafka;
  let transactionRepository: TransactionRepository;

  const mockedStatus = faker.datatype.string();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AppService,
        TransactionRepository,
        PrismaService,
        {
          provide: 'ANTI_FRAUD_MICROSERVICE',
          useValue: {
            send: jest.fn(() => ({
              subscribe: jest.fn((callback: (message: unknown) => void) => {
                callback(mockedStatus);
              }),
            })),
          },
        },
      ],
    }).compile();

    appService = module.get(AppService);
    clientKafka = module.get('ANTI_FRAUD_MICROSERVICE');
    transactionRepository = module.get(TransactionRepository);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const spyOnUpdateTransaction = jest
        .spyOn(transactionRepository, 'update')
        .mockImplementation(jest.fn());

      const value = faker.datatype.float();

      const input = {
        value,
        externalId: faker.datatype.uuid(),
        accountType: AccountTypeEnum.CREDIT,
        transferTypeId: faker.datatype.number({ max: 100 }),
      };

      const payload = JSON.stringify({
        value: new Prisma.Decimal(input.value),
      });
      const topic = 'validate_transaction';

      const callback = jest.fn();
      clientKafka.send(topic, payload).subscribe(callback);

      await appService.createTransaction(input);

      expect(clientKafka.send).toHaveBeenCalledWith(topic, payload);
      expect(callback).toHaveBeenCalled();
      expect(spyOnUpdateTransaction).toHaveBeenCalledWith({
        uuid: expect.any(String),
        status: mockedStatus,
      });
    });
  });
});
