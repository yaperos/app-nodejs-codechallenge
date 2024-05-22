import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AntifraudRequest,
  AntifraudResponse,
} from '@app-nodejs-codechallenge/core-lib';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            validateTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('verifyFraud', () => {
    it('should log and call verifyFraud on AppService', () => {
      const request: AntifraudRequest = {
        amount: 1500,
        key: 'key',
        from: 'from',
        to: 'to',
      };
      const expectedResponse: AntifraudResponse = {
        isFraud: true,
        amount: 1500,
        message: 'Fraud detected amount > 1000',
      };

      jest
        .spyOn(appService, 'validateTransaction')
        .mockImplementation(() => expectedResponse);

      const result = appController.validateTransaction(request);

      expect(appService.validateTransaction).toHaveBeenCalledWith(request);
      expect(result).toEqual(expectedResponse);
    });
  });
});
