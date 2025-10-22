import { AccountId } from './account-id.vo';

describe('AccountId', () => {
  describe('Constructor and Validation', () => {
    it('should create AccountId with valid phone number format', () => {
      const accountId = new AccountId('+51987654321');
      expect(accountId.value).toBe('+51987654321');
    });

    it('should create AccountId with valid account ID format', () => {
      const accountId = new AccountId('ABC12345678');
      expect(accountId.value).toBe('ABC12345678');
    });

    it('should create AccountId with phone number without plus sign', () => {
      const accountId = new AccountId('51987654321');
      expect(accountId.value).toBe('51987654321');
    });

    it('should throw error when AccountId is empty', () => {
      expect(() => new AccountId('')).toThrow('AccountId cannot be empty');
    });

    it('should throw error when AccountId is only whitespace', () => {
      expect(() => new AccountId('   ')).toThrow('AccountId cannot be empty');
    });

    it('should throw error when AccountId has invalid phone format', () => {
      expect(() => new AccountId('123')).toThrow('Invalid AccountId format');
    });

    it('should throw error when AccountId has invalid account format', () => {
      expect(() => new AccountId('abc')).toThrow('Invalid AccountId format');
    });

    it('should accept account ID starting with zero', () => {

      const accountId = new AccountId('0123456789');
      expect(accountId.value).toBe('0123456789');
    });

    it('should create AccountId with minimum valid phone length (9 digits)', () => {
      const accountId = new AccountId('123456789');
      expect(accountId.value).toBe('123456789');
    });

    it('should create AccountId with maximum valid phone length (15 digits)', () => {
      const accountId = new AccountId('123456789012345');
      expect(accountId.value).toBe('123456789012345');
    });

    it('should create AccountId with minimum valid account ID length (8 chars)', () => {
      const accountId = new AccountId('ABCD1234');
      expect(accountId.value).toBe('ABCD1234');
    });

    it('should create AccountId with maximum valid account ID length (20 chars)', () => {
      const accountId = new AccountId('ABCD1234567890123456'); 
      expect(accountId.value).toBe('ABCD1234567890123456');
    });
  });

  describe('equals', () => {
    it('should return true when AccountIds have same value', () => {
      const accountId1 = new AccountId('+51987654321');
      const accountId2 = new AccountId('+51987654321');

      expect(accountId1.equals(accountId2)).toBe(true);
    });

    it('should return false when AccountIds have different values', () => {
      const accountId1 = new AccountId('+51987654321');
      const accountId2 = new AccountId('+51987654322');

      expect(accountId1.equals(accountId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const accountId = new AccountId('ABC12345678');

      expect(accountId.equals(accountId)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      const accountId = new AccountId('+51987654321');

      expect(accountId.toString()).toBe('+51987654321');
    });

    it('should return account ID value as string', () => {
      const accountId = new AccountId('ABC12345678');

      expect(accountId.toString()).toBe('ABC12345678');
    });
  });

  describe('toJSON', () => {
    it('should return the value for JSON serialization', () => {
      const accountId = new AccountId('+51987654321');

      expect(accountId.toJSON()).toBe('+51987654321');
    });

    it('should return account ID value for JSON serialization', () => {
      const accountId = new AccountId('ABC12345678');

      expect(accountId.toJSON()).toBe('ABC12345678');
    });

    it('should be serializable with JSON.stringify', () => {
      const accountId = new AccountId('ABC12345678');
      const json = JSON.stringify({ accountId });

      expect(json).toContain('ABC12345678');
    });
  });
});
