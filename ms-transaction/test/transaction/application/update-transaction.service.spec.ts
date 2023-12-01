import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UpdateStatusTransactionService } from '../../../src/transaction/application/update-status.transaction.service';
import { TransactionRepository } from '../../../src/transaction/domain/repositories/transaction.repository';
import { UpdateStatusTransactionDto } from '../../../src/transaction/infrastructure/dtos/update-status-transaction.dto';
import { TransactionStatus } from '../../../src/transaction/domain/enums/transaction-status.enum';

const transactionRepository = {
  save: jest.fn(),
  getById: jest.fn(),
  updateStatus: jest.fn(),
};

describe('Update Transaction Service', () => {
  let updateStatusTransactionService: UpdateStatusTransactionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateStatusTransactionService,
        {
          provide: TransactionRepository,
          useValue: transactionRepository,
        },
      ],
    }).compile();

    updateStatusTransactionService =
      await module.resolve<UpdateStatusTransactionService>(
        UpdateStatusTransactionService,
      );
    jest.clearAllMocks();
  });

  it('should return void with valid data', async () => {
    const updateStatusTransactionDto: UpdateStatusTransactionDto = {
      id: faker.string.uuid(),
      status: TransactionStatus.APPROVED,
    };

    await updateStatusTransactionService.execute(updateStatusTransactionDto);

    expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
      updateStatusTransactionDto.id,
      updateStatusTransactionDto.status,
    );
  });
});
