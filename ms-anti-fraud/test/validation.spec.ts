import { isRejected } from '../src/utils/validation';

describe('isRejected', () => {
  it('should return true if the value is greater than or equal to 1000', () => {
    expect(isRejected(1000)).toBe(true);
    expect(isRejected(2000)).toBe(true);
    expect(isRejected(5000)).toBe(true);
  });

  it('should return false if the value is less than 1000', () => {
    expect(isRejected(999)).toBe(false);
    expect(isRejected(500)).toBe(false);
    expect(isRejected(0)).toBe(false);
  });
});
