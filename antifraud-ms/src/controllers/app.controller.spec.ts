import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../services/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('Should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should get validateTransaction', async () => {
    const mockData = {
      id: "b6fbf1d1-a35a-4952-bf64-f8dee9238c0e",
      accountExternalIdDebit: "07261b14-7db4-444d-9373-898a7abb1f08",
      accountExternalIdCredit: "a7eefd9a-36b9-4393-b967-e7999a923b3e",
      tranferTypeId: 3,
      value: 1001,
      status: "pending",
      createdAt: "2023-02-04T19:51:45.027Z",
      updatedAt: "2023-02-04T19:51:45.027Z",
    };
    
    const expectResult = { id: "b6fbf1d1-a35a-4952-bf64-f8dee9238c0e", status: "rejected"}

    expect(appController.validateTransaction(mockData))
      .toEqual(expectResult);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });
});
