import { validate } from 'class-validator';

import { STATUS_ENUM, TransactionUpdateDto } from './transaction-update.dto';

describe('TransactionUpdateDto', () => {
  it('should not validate if transactionId is not a UUID', async () => {
    const dto = new TransactionUpdateDto();
    dto.transactionId = 'not-a-uuid';
    dto.status = STATUS_ENUM.APPROVED;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('transactionId');
  });

  it('should not validate if status is not a valid enum value', async () => {
    const dto = new TransactionUpdateDto();
    dto.transactionId = 'd28beff0-c093-48a7-b88c-59458ec74d1c';
    dto.status = 'INVALID';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('status');
  });

  it('should validate if transactionId is a UUID and status is a valid enum value', async () => {
    const dto = new TransactionUpdateDto();
    dto.transactionId = 'd28beff0-c093-48a7-b88c-59458ec74d1c';
    dto.status = STATUS_ENUM.APPROVED;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
