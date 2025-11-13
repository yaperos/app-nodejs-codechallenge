import { approveOrReject } from './decision';

describe('approveOrReject', () => {
  it('rejects transactions above the threshold', () => {
    const result = approveOrReject({ value: 1500 });

    expect(result).toEqual({
      status: 'rejected',
      reason: 'Value exceeds threshold of 1000',
    });
  });

  it('approves transactions at or below the threshold', () => {
    const result = approveOrReject({ value: 1000 });

    expect(result).toEqual({ status: 'approved', reason: null });
  });
});
