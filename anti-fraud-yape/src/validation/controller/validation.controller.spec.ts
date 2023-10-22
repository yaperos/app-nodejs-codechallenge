import { Test, TestingModule } from '@nestjs/testing';
import { ValidationController } from './validation.controller';
import { ClientProxy } from '@nestjs/microservices';

describe('ValidationController', () => {
  let controller: ValidationController;
  let kafkaClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidationController],
      providers: [
        {
          provide: 'ANTIFRAUD_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ValidationController>(ValidationController);
    kafkaClient = module.get<ClientProxy>('ANTIFRAUD_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should emit transaction_updated event with status approved', async () => {
    const mockEventData = { message: { value: 1200 } };
    const expectedUpdatedEvent = {
      message: {
        ...mockEventData.message,
        transactionStatusId: mockEventData.message.value > 1000 ? 3 : 2,
      },
    };
    jest.spyOn(kafkaClient, 'emit').mockImplementation();

    await controller.handlerTransactionCreated(mockEventData);

    expect(kafkaClient.emit).toHaveBeenCalledWith('transaction_updated', expectedUpdatedEvent);

    jest.restoreAllMocks();
  });

  it('should emit transaction_updated event with status rejected', async () => {
    const mockEventData = { message: { value: 200 } };
    const expectedUpdatedEvent = {
      message: {
        ...mockEventData.message,
        transactionStatusId: mockEventData.message.value > 1000 ? 3 : 2,
      },
    };
    jest.spyOn(kafkaClient, 'emit').mockImplementation();

    await controller.handlerTransactionCreated(mockEventData);

    expect(kafkaClient.emit).toHaveBeenCalledWith('transaction_updated', expectedUpdatedEvent);

    jest.restoreAllMocks();
  });
});
