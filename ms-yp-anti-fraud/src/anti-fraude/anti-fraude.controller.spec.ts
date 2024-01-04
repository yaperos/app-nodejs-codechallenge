import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudeController } from './anti-fraude.controller';
import { AntiFraudeService } from './anti-fraude.service';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusEnum } from '../enums/transaction.status.enum';
import { updatedTransactionEvent } from '../utils/createdTransactionEvent';
import { UPDATED_TRANSACTION_STATUS_TOPIC } from '../constants/commons';

describe('AntiFraudeController', () => {
  let controller: AntiFraudeController;
  let transactionClient: ClientKafka;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudeController],
      providers: [
        AntiFraudeService,
        {
          provide: 'TRANSACTION_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AntiFraudeController>(AntiFraudeController);
    transactionClient = module.get<ClientKafka>('TRANSACTION_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(transactionClient).toBeDefined();
  });

  describe('handleUpdatedTransactionStatus', () => {
    it('should update transaction status', async () => {
      const mockPayload = {
        id: 'a174016d-50f5-445d-ba57-49a2e94e6f9b',
        transactionExternalId: 'Guid',
        transactionType: 1,
        transactionStatus: TransactionStatusEnum.REJECTED,
        value: 1300,
        createdAt: '2021-12-2',
      };

      await controller.handleUpdatedTransactionStatus(mockPayload);

      expect(transactionClient.emit).toHaveBeenCalledWith(
        UPDATED_TRANSACTION_STATUS_TOPIC,
        updatedTransactionEvent(mockPayload),
      );
    });
  });
});
