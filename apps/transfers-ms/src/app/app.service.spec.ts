import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AntifraudService } from '@app-nodejs-codechallenge/antifraud-lib';
import {
  PrismaService,
  TransactionStatus,
} from '@app-nodejs-codechallenge/core-lib';
import { NotFoundException } from '@nestjs/common';
import { TransferCommand } from './interfaces/transfer.command';

describe('AppService', () => {
  let appService: AppService;
  let antifraudService: Partial<AntifraudService>;
  let prismaService: Partial<PrismaService>;

  beforeEach(async () => {
    antifraudService = {
      validateTransaction: jest.fn(),
    };

    prismaService = {
      transaction: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      } as any, // Casting to 'any' to avoid type issues with partial mocking
      transferType: {
        findUnique: jest.fn(),
      } as any, // Casting to 'any' to avoid type issues with partial mocking
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: AntifraudService, useValue: antifraudService },
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getTransaction', () => {
    it('should return transaction details', async () => {
      const transaction = {
        id: '1',
        accountExternalIdDebit: 'debit-id',
        transferType: { name: 'transfer' },
        status: TransactionStatus.PENDING,
        value: 100,
        createdAt: new Date(),
      };

      (prismaService.transaction.findUnique as jest.Mock).mockResolvedValue(
        transaction
      );

      const result = await appService.getTransaction('1');
      expect(result).toEqual({
        transactionExternalId: 'debit-id',
        transactionType: { name: 'transfer' },
        transactionStatus: { name: 'PENDING' },
        value: 100,
        createdAt: transaction.createdAt,
      });
    });

    it('should throw NotFoundException if transaction not found', async () => {
      (prismaService.transaction.findUnique as jest.Mock).mockResolvedValue(
        null
      );

      await expect(appService.getTransaction('1')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('saveTransfer', () => {
    it('should save and return transfer details', async () => {
      const transfer: TransferCommand = {
        value: 100,
        accountExternalIdDebit: 'debit-id',
        accountExternalIdCredit: 'credit-id',
        transferTypeId: 1,
      };

      const transferType = { id: 1, name: 'transfer' };
      const transaction = {
        id: '1',
        accountExternalIdDebit: 'debit-id',
        accountExternalIdCredit: 'credit-id',
        transferTypeId: 1,
        status: TransactionStatus.PENDING,
        value: 100,
        createdAt: new Date(),
      };

      const antifraudResult = { isFraud: false, message: 'Approved' };

      (prismaService.transferType.findUnique as jest.Mock).mockResolvedValue(
        transferType
      );
      (prismaService.transaction.create as jest.Mock).mockResolvedValue(
        transaction
      );
      (antifraudService.validateTransaction as jest.Mock).mockResolvedValue(
        antifraudResult
      );
      (prismaService.transaction.update as jest.Mock).mockResolvedValue({
        ...transaction,
        status: TransactionStatus.APPROVED,
      });

      const result = await appService.saveTransfer(transfer);
      expect(result).toEqual({
        message: 'Approved',
        transactionExternalId: 'debit-id',
        transactionType: { name: 'transfer' },
        transactionStatus: { name: 'APPROVED' },
        value: 100,
        createdAt: transaction.createdAt,
      });
    });

    it('should throw NotFoundException if transfer type not found', async () => {
      const transfer: TransferCommand = {
        value: 100,
        accountExternalIdDebit: 'debit-id',
        accountExternalIdCredit: 'credit-id',
        transferTypeId: 1,
      };

      (prismaService.transferType.findUnique as jest.Mock).mockResolvedValue(
        null
      );

      await expect(appService.saveTransfer(transfer)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
