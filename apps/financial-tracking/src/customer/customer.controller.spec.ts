import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PrismaService } from '../prisma/prisma.service';

const mockFindManyCustomers = [
  {
    id: 'f6cf15b6-d871-4cc3-87fb-68132454892a',
    name: 'Customer Name 1',
    email: 'customer.name@gmail.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '620a7e4d-8979-436a-a6e0-f0a706745506',
    name: 'Customer Name 2',
    email: 'customer.name@gmail.com',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const mockFindMany = jest.fn();

jest.mock('../prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        customer: {
          findMany: mockFindMany,
        },
      };
    }),
  };
});

describe('CustomerController', () => {
  let customerController: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService, PrismaService],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
  });

  it('should return a list of empty customers', async () => {
    (mockFindMany as jest.Mock).mockResolvedValue([]);
    expect(await customerController.all()).toEqual([]);
  });

  it('should return a list of all customers', async () => {
    (mockFindMany as jest.Mock).mockResolvedValue(mockFindManyCustomers);
    expect(await customerController.all()).toEqual(mockFindManyCustomers);
  });
});
