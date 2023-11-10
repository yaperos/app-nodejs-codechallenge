import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dto/validate-transaction.dto';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

enum TransactionState {
  Approved = 'approved',
  Rejected = 'rejected',
}

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('validateTransaction', () => {
    it('should validate and update the transaction with value less than 1000', async () => {
      const dto: TransactionDto = { uuid: '123', value: 500 };
      const serviceSpy = jest
        .spyOn(service, 'validateTransaction')
        .mockResolvedValue(true);
      const axiosSpy = jest
        .spyOn(mockedAxios, 'request')
        .mockResolvedValue({ data: {} });

      await controller.validateTransaction(dto);

      expect(serviceSpy).toHaveBeenCalledWith(dto);
      expect(axiosSpy).toHaveBeenCalled();
    });
    it('should validate and update the transaction with value greater than 1000', async () => {
      const dto: TransactionDto = { uuid: '123', value: 1500 };
      const serviceSpy = jest
        .spyOn(service, 'validateTransaction')
        .mockResolvedValue(false);
      const axiosSpy = jest
        .spyOn(mockedAxios, 'request')
        .mockResolvedValue({ data: {} });

      await controller.validateTransaction(dto);

      expect(serviceSpy).toHaveBeenCalledWith(dto);
      expect(axiosSpy).toHaveBeenCalled();
    });
  });

  describe('buildGraphQLMutation', () => {
    it('should build a GraphQL mutation string', () => {
      const uuid = '123';
      const state = 'approved';
      const result = controller['buildGraphQLMutation'](
        uuid,
        TransactionState.Approved,
      );

      expect(result).toContain(uuid);
      expect(result).toContain(state);
    });
  });

  describe('sendGraphQLRequest', () => {
    it('should send a GraphQL request', async () => {
      const data = '{}';
      const axiosSpy = jest
        .spyOn(mockedAxios, 'request')
        .mockResolvedValue({ data: {} });

      await controller['sendGraphQLRequest'](data);

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({ data }));
    });

    it('should throw an error when the GraphQL request fails', async () => {
      const dto: TransactionDto = { uuid: '123', value: 500 };
      jest.spyOn(service, 'validateTransaction').mockResolvedValue(true);
      jest
        .spyOn(mockedAxios, 'request')
        .mockRejectedValue(new Error('GraphQL error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await controller.validateTransaction(dto);

      expect(consoleSpy).toHaveBeenCalledWith(new Error('GraphQL error'));
    });
  });
});
