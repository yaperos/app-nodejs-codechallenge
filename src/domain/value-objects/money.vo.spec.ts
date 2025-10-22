import { Money } from './money.vo';

describe('Money', () => {
  describe('Constructor and Validation', () => {
    it('should create Money with valid amount and default currency', () => {
      const money = new Money(100);

      expect(money.amount).toBe(100);
      expect(money.currency).toBe('PEN');
    });

    it('should create Money with valid amount and custom currency', () => {
      const money = new Money(100, 'USD');

      expect(money.amount).toBe(100);
      expect(money.currency).toBe('USD');
    });

    it('should create Money with zero amount', () => {
      const money = new Money(0, 'PEN');

      expect(money.amount).toBe(0);
    });

    it('should create Money with decimal amount', () => {
      const money = new Money(99.99, 'PEN');

      expect(money.amount).toBe(99.99);
    });

    it('should throw error when amount is negative', () => {
      expect(() => new Money(-1, 'PEN')).toThrow('Amount cannot be negative');
    });

    it('should throw error when currency is empty', () => {
      expect(() => new Money(100, '')).toThrow('Invalid currency code');
    });

    it('should throw error when currency code is too short', () => {
      expect(() => new Money(100, 'PE')).toThrow('Invalid currency code');
    });

    it('should throw error when currency code is too long', () => {
      expect(() => new Money(100, 'PENS')).toThrow('Invalid currency code');
    });

    it('should throw error when currency is null', () => {
      expect(() => new Money(100, null as any)).toThrow('Invalid currency code');
    });
  });

  describe('add', () => {
    it('should add two Money objects with same currency', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'PEN');

      const result = money1.add(money2);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('PEN');
    });

    it('should add Money with zero', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(0, 'PEN');

      const result = money1.add(money2);

      expect(result.amount).toBe(100);
    });

    it('should throw error when adding different currencies', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'USD');

      expect(() => money1.add(money2)).toThrow('Cannot add different currencies');
    });

    it('should add decimal amounts correctly', () => {
      const money1 = new Money(99.99, 'PEN');
      const money2 = new Money(0.01, 'PEN');

      const result = money1.add(money2);

      expect(result.amount).toBe(100);
    });
  });

  describe('subtract', () => {
    it('should subtract two Money objects with same currency', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'PEN');

      const result = money1.subtract(money2);

      expect(result.amount).toBe(50);
      expect(result.currency).toBe('PEN');
    });

    it('should subtract to zero', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(100, 'PEN');

      const result = money1.subtract(money2);

      expect(result.amount).toBe(0);
    });

    it('should throw error when subtracting different currencies', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'USD');

      expect(() => money1.subtract(money2)).toThrow('Cannot subtract different currencies');
    });

    it('should throw error when result would be negative', () => {
      const money1 = new Money(50, 'PEN');
      const money2 = new Money(100, 'PEN');

      expect(() => money1.subtract(money2)).toThrow('Insufficient amount');
    });

    it('should subtract decimal amounts correctly', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(0.01, 'PEN');

      const result = money1.subtract(money2);

      expect(result.amount).toBe(99.99);
    });
  });

  describe('multiply', () => {
    it('should multiply Money by positive factor', () => {
      const money = new Money(100, 'PEN');

      const result = money.multiply(2);

      expect(result.amount).toBe(200);
      expect(result.currency).toBe('PEN');
    });

    it('should multiply by zero', () => {
      const money = new Money(100, 'PEN');

      const result = money.multiply(0);

      expect(result.amount).toBe(0);
    });

    it('should multiply by decimal factor', () => {
      const money = new Money(100, 'PEN');

      const result = money.multiply(0.5);

      expect(result.amount).toBe(50);
    });

    it('should multiply by one returns same amount', () => {
      const money = new Money(100, 'PEN');

      const result = money.multiply(1);

      expect(result.amount).toBe(100);
    });
  });

  describe('equals', () => {
    it('should return true for Money objects with same amount and currency', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(100, 'PEN');

      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for Money objects with different amounts', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'PEN');

      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for Money objects with different currencies', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(100, 'USD');

      expect(money1.equals(money2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const money = new Money(100, 'PEN');

      expect(money.equals(money)).toBe(true);
    });
  });

  describe('isGreaterThan', () => {
    it('should return true when amount is greater', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'PEN');

      expect(money1.isGreaterThan(money2)).toBe(true);
    });

    it('should return false when amount is equal', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(100, 'PEN');

      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it('should return false when amount is less', () => {
      const money1 = new Money(50, 'PEN');
      const money2 = new Money(100, 'PEN');

      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it('should throw error when comparing different currencies', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'USD');

      expect(() => money1.isGreaterThan(money2)).toThrow('Cannot compare different currencies');
    });
  });

  describe('isLessThan', () => {
    it('should return true when amount is less', () => {
      const money1 = new Money(50, 'PEN');
      const money2 = new Money(100, 'PEN');

      expect(money1.isLessThan(money2)).toBe(true);
    });

    it('should return false when amount is equal', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(100, 'PEN');

      expect(money1.isLessThan(money2)).toBe(false);
    });

    it('should return false when amount is greater', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'PEN');

      expect(money1.isLessThan(money2)).toBe(false);
    });

    it('should throw error when comparing different currencies', () => {
      const money1 = new Money(100, 'PEN');
      const money2 = new Money(50, 'USD');

      expect(() => money1.isLessThan(money2)).toThrow('Cannot compare different currencies');
    });
  });

  describe('toJSON', () => {
    it('should return object with amount and currency', () => {
      const money = new Money(100, 'PEN');

      const json = money.toJSON();

      expect(json).toEqual({ amount: 100, currency: 'PEN' });
    });

    it('should be serializable with JSON.stringify', () => {
      const money = new Money(99.99, 'USD');

      const json = JSON.stringify(money);

      expect(json).toContain('99.99');
      expect(json).toContain('USD');
    });

    it('should handle zero amount in JSON', () => {
      const money = new Money(0, 'PEN');

      const json = money.toJSON();

      expect(json).toEqual({ amount: 0, currency: 'PEN' });
    });
  });
});
