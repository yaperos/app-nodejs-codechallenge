import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { ValidateTransactionController } from '../../../../src/antifraud/infrastructure/controllers/validate-transaction.controller';
import { ValidateTransactionService } from '../../../../src/antifraud/application/validate-transaction.service';
import { ValidateTransactionDto } from '../../../../src/antifraud/infrastructure/dtos/validate-transaction.dto';

const validateTransactionService = {
  execute: jest.fn(),
};

describe('Validate Transaction Controller', () => {
  let validateTransactionController: ValidateTransactionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ValidateTransactionController],
      providers: [
        {
          provide: ValidateTransactionService,
          useValue: validateTransactionService,
        },
      ],
    }).compile();

    validateTransactionController =
      await module.resolve<ValidateTransactionController>(
        ValidateTransactionController,
      );
    jest.clearAllMocks();
  });

  it('should return void with valid data', async () => {
    const validateTransactionDto: ValidateTransactionDto = {
      id: faker.string.uuid(),
      value: faker.number.int(),
    };

    await validateTransactionController.handler(validateTransactionDto);
    expect(validateTransactionService.execute).toHaveBeenCalledWith(
      validateTransactionDto,
    );
  });
});
