import { TransactionUpdatedResponse } from './transaction-updated.dto';

describe('TransactionUpdatedResponse', () => {
  it('should correctly assign values', () => {
    const dto = new TransactionUpdatedResponse();
    dto.transactionId = 'd28beff0-c093-48a7-b88c-59458ec74d1c';
    dto.status = 'APPROVED';

    expect(dto.transactionId).toEqual('d28beff0-c093-48a7-b88c-59458ec74d1c');
    expect(dto.status).toEqual('APPROVED');
  });
});
