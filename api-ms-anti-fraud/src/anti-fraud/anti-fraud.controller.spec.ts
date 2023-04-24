import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientKafka } from '@nestjs/microservices';
import { EVENT_TRANSACTION_FAILED, EVENT_TRANSACTION_SUCCESS } from '../constants';

describe('AntiFraudController', () => {
  let controller: AntiFraudController;
  let client: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudController],
      providers: [
        {
          provide: 'TRANSACTION_PACKAGE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AntiFraudController>(AntiFraudController);
    client = module.get<ClientKafka>('TRANSACTION_PACKAGE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('validateTransaction', () => {
    it('should be defined', () => {
      expect(controller.validateTransaction).toBeDefined();
    });

    it('should call emit with EVENT_TRANSACTION_SUCCESS', () => {
      jest.spyOn(client, 'emit').mockImplementation(() => null);
      const data = { id: '1', value: 100 };
      controller.validateTransaction(data);
      expect(client.emit).toBeCalledWith(EVENT_TRANSACTION_SUCCESS, { id: '1' });
    });

    it('should call emit with EVENT_TRANSACTION_FAILED', () => {
      jest.spyOn(client, 'emit').mockImplementation(() => null);
      const data = { id: '1', value: 1500 };
      controller.validateTransaction(data);
      expect(client.emit).toBeCalledWith(EVENT_TRANSACTION_FAILED, { id: '1' });
    });
  });
});
