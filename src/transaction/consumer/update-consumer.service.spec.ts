import { UpdateConsumerService } from './update-consumer.service';
import { ConsumerService } from '../../core/notificator/consumer/consumer.service';
import { TransactionRepository } from '../repository/transaction.repository';
import { Utils } from '../../util/utils';

describe('UpdateConsumerService', () => {
  let updateConsumerService: UpdateConsumerService;
  let consumerService: ConsumerService;
  let repository: TransactionRepository;
  let util: Utils;

  beforeEach(() => {
    consumerService = {
      consumeUpdate: jest.fn(),
    } as unknown as ConsumerService;

    repository = {
      updateById: jest.fn(),
    } as unknown as TransactionRepository;

    util = {
      builderCreateTransaction: jest.fn(),
    } as unknown as Utils;

    updateConsumerService = new UpdateConsumerService(
      consumerService,
      repository,
      util,
    );
  });

  it('should consume update data topic on module init', async () => {
    await updateConsumerService.onModuleInit();

    expect(consumerService.consumeUpdate).toHaveBeenCalledWith(
      { topics: ['update-data'], fromBeginning: false },
      expect.any(Object),
    );
  });
});