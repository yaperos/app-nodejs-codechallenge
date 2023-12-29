import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusEnum, TransactionDto } from './models/Transaction.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  // Mock the ANTIFRAUD_MICROSERVICE
  const antifraudMicroserviceMock = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: 'ANTIFRAUD_MICROSERVICE',
          useValue: antifraudMicroserviceMock,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('handleTransactionCreation', () => {
    it('should call processTransaction method with validated data', () => {
      // Arrange
      const mockedTransaction: TransactionDto = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };

      // Mock the appService's processTransaction method
      jest.spyOn(appService, 'processTransaction').mockImplementation();

      // Act
      appController.handleTransactionCreation(mockedTransaction);

      // Assert
      expect(appService.processTransaction).toHaveBeenCalledWith(
        mockedTransaction,
      );
    });
  });
});
