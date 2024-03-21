import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

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

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleTransactionCreate', () => {
    it('should call validateTransaction with correct data', async () => {
      const createTransactionDto: CreateTransactionDto = {
        id: '1',
        accountExternalIdDebit: '11111',
        accountExternalIdCredit: '2222',
        tranferTypeId: 1,
        value: 100,
        status: 'PENDING',
      };

      await controller.handleTransactionCreate(createTransactionDto);

      expect(service.validateTransaction).toHaveBeenCalledWith(
        createTransactionDto,
      );
    });
  });
});
