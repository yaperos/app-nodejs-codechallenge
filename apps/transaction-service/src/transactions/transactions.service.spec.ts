import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma';
import { KafkaService } from '../kafka';
import { CreateTransactionDto } from './dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: jest.Mocked<PrismaService>;
  let kafkaService: jest.Mocked<KafkaService>;

  // Mock data
  const mockPendingStatus = { id: 1, name: 'pending' };
  const mockApprovedStatus = { id: 2, name: 'approved' };
  const mockTransactionType = { id: 1, name: 'Transferencia' };

  const mockTransaction = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    accountExternalIdDebit: '550e8400-e29b-41d4-a716-446655440001',
    accountExternalIdCredit: '550e8400-e29b-41d4-a716-446655440002',
    value: 500,
    transactionTypeId: 1,
    transactionStatusId: 1,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    transactionType: mockTransactionType,
    transactionStatus: mockPendingStatus,
  };

  const createTransactionDto: CreateTransactionDto = {
    accountExternalIdDebit: '550e8400-e29b-41d4-a716-446655440001',
    accountExternalIdCredit: '550e8400-e29b-41d4-a716-446655440002',
    tranferTypeId: 1,
    value: 500,
  };

  beforeEach(async () => {
    // Create mock implementations
    const mockPrismaService = {
      transactionStatus: {
        findUnique: jest.fn(),
      },
      transactionType: {
        findUnique: jest.fn(),
      },
      transaction: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const mockKafkaService = {
      produce: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: KafkaService, useValue: mockKafkaService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get(PrismaService);
    kafkaService = module.get(KafkaService);
  });

  describe('create', () => {
    it('should create a transaction with pending status', async () => {
      // Arrange
      prismaService.transactionStatus.findUnique.mockResolvedValue(mockPendingStatus);
      prismaService.transactionType.findUnique.mockResolvedValue(mockTransactionType);
      prismaService.transaction.create.mockResolvedValue(mockTransaction);
      kafkaService.produce.mockResolvedValue(undefined);

      // Act
      const result = await service.create(createTransactionDto);

      // Assert
      expect(result).toEqual({
        transactionExternalId: mockTransaction.id,
        transactionType: { name: 'Transferencia' },
        transactionStatus: { name: 'pending' },
        value: 500,
        createdAt: mockTransaction.createdAt,
      });

      expect(prismaService.transactionStatus.findUnique).toHaveBeenCalledWith({
        where: { name: 'pending' },
      });

      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
          accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
          value: createTransactionDto.value,
          transactionTypeId: createTransactionDto.tranferTypeId,
          transactionStatusId: mockPendingStatus.id,
        },
        include: {
          transactionType: true,
          transactionStatus: true,
        },
      });

      expect(kafkaService.produce).toHaveBeenCalledWith(
        'transaction-created',
        expect.objectContaining({
          transactionExternalId: mockTransaction.id,
          value: 500,
        }),
      );
    });

    it('should throw NotFoundException when transaction type does not exist', async () => {
      // Arrange
      prismaService.transactionStatus.findUnique.mockResolvedValue(mockPendingStatus);
      prismaService.transactionType.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createTransactionDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createTransactionDto)).rejects.toThrow(
        'Transaction type with id 1 not found',
      );
    });

    it('should throw Error when pending status does not exist', async () => {
      // Arrange
      prismaService.transactionStatus.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createTransactionDto)).rejects.toThrow(
        'Pending status not found in database',
      );
    });
  });

  describe('findOne', () => {
    it('should return a transaction when found', async () => {
      // Arrange
      prismaService.transaction.findUnique.mockResolvedValue(mockTransaction);

      // Act
      const result = await service.findOne(mockTransaction.id);

      // Assert
      expect(result).toEqual({
        transactionExternalId: mockTransaction.id,
        transactionType: { name: 'Transferencia' },
        transactionStatus: { name: 'pending' },
        value: 500,
        createdAt: mockTransaction.createdAt,
      });

      expect(prismaService.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: mockTransaction.id },
        include: {
          transactionType: true,
          transactionStatus: true,
        },
      });
    });

    it('should throw NotFoundException when transaction does not exist', async () => {
      // Arrange
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      prismaService.transaction.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        `Transaction with id ${nonExistentId} not found`,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status to approved', async () => {
      // Arrange
      prismaService.transactionStatus.findUnique.mockResolvedValue(mockApprovedStatus);
      prismaService.transaction.update.mockResolvedValue({
        ...mockTransaction,
        transactionStatusId: mockApprovedStatus.id,
        transactionStatus: mockApprovedStatus,
      });

      // Act
      await service.updateStatus(mockTransaction.id, 'approved');

      // Assert
      expect(prismaService.transactionStatus.findUnique).toHaveBeenCalledWith({
        where: { name: 'approved' },
      });

      expect(prismaService.transaction.update).toHaveBeenCalledWith({
        where: { id: mockTransaction.id },
        data: { transactionStatusId: mockApprovedStatus.id },
      });
    });

    it('should update transaction status to rejected', async () => {
      // Arrange
      const mockRejectedStatus = { id: 3, name: 'rejected' };
      prismaService.transactionStatus.findUnique.mockResolvedValue(mockRejectedStatus);
      prismaService.transaction.update.mockResolvedValue({
        ...mockTransaction,
        transactionStatusId: mockRejectedStatus.id,
        transactionStatus: mockRejectedStatus,
      });

      // Act
      await service.updateStatus(mockTransaction.id, 'rejected');

      // Assert
      expect(prismaService.transactionStatus.findUnique).toHaveBeenCalledWith({
        where: { name: 'rejected' },
      });

      expect(prismaService.transaction.update).toHaveBeenCalledWith({
        where: { id: mockTransaction.id },
        data: { transactionStatusId: mockRejectedStatus.id },
      });
    });

    it('should throw Error when status does not exist', async () => {
      // Arrange
      prismaService.transactionStatus.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateStatus(mockTransaction.id, 'invalid_status'),
      ).rejects.toThrow('Status invalid_status not found in database');
    });
  });
});
