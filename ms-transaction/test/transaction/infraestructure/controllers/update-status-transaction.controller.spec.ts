import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { UpdateStatusTransactionController } from '../../../../src/transaction/infrastructure/controllers/update-status-transaction.controller';
import { UpdateStatusTransactionService } from '../../../../src/transaction/application/update-status.transaction.service';
import { UpdateStatusTransactionDto } from '../../../../src/transaction/infrastructure/dtos/update-status-transaction.dto';
import { TransactionStatus } from '../../../../src/transaction/domain/enums/transaction-status.enum';

const updateStatusTransactionService = {
  execute: jest.fn(),
};

describe('Update Status Transaction Controller', () => {
  let updateStatusTransactionController: UpdateStatusTransactionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UpdateStatusTransactionController],
      providers: [
        {
          provide: UpdateStatusTransactionService,
          useValue: updateStatusTransactionService,
        },
      ],
    }).compile();

    updateStatusTransactionController =
      await module.resolve<UpdateStatusTransactionController>(
        UpdateStatusTransactionController,
      );
    jest.clearAllMocks();
  });

  it('should return void for success update', async () => {
    const updateStatusTransactionDto: UpdateStatusTransactionDto = {
      id: faker.string.uuid(),
      status: TransactionStatus.APPROVED,
    };

    await updateStatusTransactionController.handler(updateStatusTransactionDto);

    expect(updateStatusTransactionService.execute).toHaveBeenCalled();
    expect(updateStatusTransactionService.execute).toHaveBeenCalledWith(
      updateStatusTransactionDto,
    );
  });
});
