import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma/prisma.service';

const mockFindManyAccounts = [
  {
    id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    customer_id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    balance: 1000,
    status: 'ACTIVE',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'f6cf15b6-d871-4cc3-87fb-68132454892b',
    customer_id: 'f6cf15b6-d871-4cc3-87fb-68132454892b',
    balance: 4000,
    status: 'ACTIVE',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockFindMany = jest.fn();

jest.mock('../prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        account: {
          findMany: mockFindMany,
        },
      };
    }),
  };
});

describe('AccountController', () => {
  let accountController: AccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService, PrismaService],
    }).compile();

    accountController = app.get<AccountController>(AccountController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(accountController).toBeDefined();
    });

    it('should return a list of empty accounts', async () => {
      (mockFindMany as jest.Mock).mockResolvedValue([]);
      expect(await accountController.all()).toEqual([]);
    });

    it('should return a list of all accounts', async () => {
      (mockFindMany as jest.Mock).mockResolvedValue(mockFindManyAccounts);
      expect(await accountController.all()).toEqual(mockFindManyAccounts);
    });
  });
});
