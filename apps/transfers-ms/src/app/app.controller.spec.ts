import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransferDto } from './dto/transfer.dto';
import { TransferCommand } from './interfaces/transfer.command';
import { NotFoundException } from '@nestjs/common';

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
            getTransaction: jest.fn(),
            saveTransfer: jest.fn(),
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

  describe('getTransaction', () => {
    it('should call appService.getTransaction with the correct id', async () => {
      const id = '1';
      const transaction = {
        transactionExternalId: 'debit-id',
        transactionType: { name: 'transfer' },
        transactionStatus: { name: 'PENDING' },
        value: 100,
        createdAt: new Date(),
      };
      jest.spyOn(appService, 'getTransaction').mockResolvedValue(transaction);

      const result = await appController.getTransaction(id);
      expect(result).toEqual(transaction);
      expect(appService.getTransaction).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if transaction not found', async () => {
      const id = '1';
      jest
        .spyOn(appService, 'getTransaction')
        .mockRejectedValue(new NotFoundException('Transaction not found'));

      await expect(appController.getTransaction(id)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('saveTransfer', () => {
    it('should call appService.saveTransfer with the correct command', async () => {
      const transferDto: TransferDto = {
        value: 100,
        accountExternalIdDebit: 'debit-id',
        accountExternalIdCredit: 'credit-id',
        transferTypeId: 1,
      };
      const transferCommand = new TransferCommand(transferDto);
      const saveResult = {
        message: 'Approved',
        transactionExternalId: 'debit-id',
        transactionType: { name: 'transfer' },
        transactionStatus: { name: 'APPROVED' },
        value: 100,
        createdAt: new Date(),
      };

      jest.spyOn(appService, 'saveTransfer').mockResolvedValue(saveResult);

      const result = await appController.saveTransfer(transferDto);
      expect(result).toEqual(saveResult);
      expect(appService.saveTransfer).toHaveBeenCalledWith(
        expect.objectContaining(transferCommand)
      );
    });
  });
});
