import { TransactionStatus } from '@app/contracts';
import { evaluate, toCents } from './fraud-rule';

describe('fraud rule', () => {
  it.each([
    ['0.01', TransactionStatus.Approved],
    ['120.00', TransactionStatus.Approved],
    ['999.99', TransactionStatus.Approved],
    ['1000', TransactionStatus.Approved],
    ['1000.00', TransactionStatus.Approved],
    ['1000.01', TransactionStatus.Rejected],
    ['2300.20', TransactionStatus.Rejected],
  ])('%s → %s', (value, expected) => {
    expect(evaluate(value)).toBe(expected);
  });

  it('converts decimals to exact cents', () => {
    expect(toCents('1000.1')).toBe(100010n);
    expect(toCents('0.07')).toBe(7n);
  });

  it.each(['', 'abc', '1e5', '-10', '10.123', '10.'])(
    'rejects invalid amount %p',
    (value) => {
      expect(() => toCents(value)).toThrow();
    },
  );
});
