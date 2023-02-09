import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get status: approved', () => {
    const mockData = {
      id: "b6fbf1d1-a35a-4952-bf64-f8dee9238c0e",
      accountExternalIdDebit: "07261b14-7db4-444d-9373-898a7abb1f08",
      accountExternalIdCredit: "a7eefd9a-36b9-4393-b967-e7999a923b3e",
      tranferTypeId: 3,
      value: 902,
      status: "pending",
      createdAt: "2023-02-04T19:51:45.027Z",
      updatedAt: "2023-02-04T19:51:45.027Z",
    };

    const { status } = service.validateTransaction(mockData);
    expect(status).toEqual('approved')
  });
  
  it('should get status: rejected', () => {
    const mockData = {
      id: "b6fbf1d1-a35a-4952-bf64-f8dee9238c0e",
      accountExternalIdDebit: "07261b14-7db4-444d-9373-898a7abb1f08",
      accountExternalIdCredit: "a7eefd9a-36b9-4393-b967-e7999a923b3e",
      tranferTypeId: 3,
      value: 1002,
      status: "pending",
      createdAt: "2023-02-04T19:51:45.027Z",
      updatedAt: "2023-02-04T19:51:45.027Z",
    };

    const { status } = service.validateTransaction(mockData);
    expect(status).toEqual('rejected')
  });
});
