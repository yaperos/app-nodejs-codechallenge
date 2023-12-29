import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { StatusEnum, TransactionDto } from './models/Transaction.dto';
import { ClientKafka } from '@nestjs/microservices';

describe('AppService', () => {
  let appService: AppService;
  let antifraudClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'ANTIFRAUD_MICROSERVICE',
          useFactory: () => ({
            emit: jest.fn(),
          }),
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    antifraudClient = module.get<ClientKafka>('ANTIFRAUD_MICROSERVICE');
  });

  describe('processTransaction', () => {
    it('should validate and send status for an approved transaction', () => {
      // Arrange
      const transaction: TransactionDto = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };

      // Act
      appService.processTransaction(transaction);

      // Assert
      expect(antifraudClient.emit).toHaveBeenCalledWith(
        expect.any(String), // topic
        JSON.stringify({ id: transaction.id, status: StatusEnum.APPROVED }),
      );
    });

    it('should validate and send status for a rejected transaction', () => {
      // Arrange
      const transaction: TransactionDto = {
        id: '69ad28b5-0b2f-4bf9-945e-f17b5977b8a9',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid',
        transferTypeId: 1,
        value: 1500,
        status: StatusEnum.PENDING,
        createdAt: new Date(),
      };

      // Act
      appService.processTransaction(transaction);

      // Assert
      expect(antifraudClient.emit).toHaveBeenCalledWith(
        expect.any(String), // topic
        JSON.stringify({ id: transaction.id, status: StatusEnum.REJECTED }),
      );
    });
  });
});
