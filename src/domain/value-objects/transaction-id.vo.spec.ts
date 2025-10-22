import { TransactionId } from './transaction-id.vo';
import { validate as uuidValidate } from 'uuid';

describe('TransactionId', () => {
  describe('Constructor and Validation', () => {
    it('should create TransactionId with auto-generated UUID when no value provided', () => {
      const transactionId = new TransactionId();

      expect(transactionId.value).toBeDefined();
      expect(uuidValidate(transactionId.value)).toBe(true);
    });

    it('should create TransactionId with valid UUID value', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const transactionId = new TransactionId(validUuid);

      expect(transactionId.value).toBe(validUuid);
    });

    it('should throw error when value is not a valid UUID', () => {
      const invalidUuid = 'not-a-uuid';

      expect(() => new TransactionId(invalidUuid)).toThrow('Invalid TransactionId format');
    });

    it('should throw error when value is empty string', () => {
      expect(() => new TransactionId('')).toThrow('Invalid TransactionId format');
    });

    it('should throw error when value is malformed UUID', () => {
      const malformedUuid = '123e4567-e89b-12d3-a456';

      expect(() => new TransactionId(malformedUuid)).toThrow('Invalid TransactionId format');
    });

    it('should create TransactionId with uppercase UUID', () => {
      const validUuid = '123E4567-E89B-12D3-A456-426614174000';
      const transactionId = new TransactionId(validUuid);

      expect(transactionId.value).toBe(validUuid);
    });

    it('should generate different UUIDs for multiple instances', () => {
      const transactionId1 = new TransactionId();
      const transactionId2 = new TransactionId();

      expect(transactionId1.value).not.toBe(transactionId2.value);
    });
  });

  describe('equals', () => {
    it('should return true when TransactionIds have same value', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const transactionId1 = new TransactionId(uuid);
      const transactionId2 = new TransactionId(uuid);

      expect(transactionId1.equals(transactionId2)).toBe(true);
    });

    it('should return false when TransactionIds have different values', () => {
      const uuid1 = '123e4567-e89b-12d3-a456-426614174000';
      const uuid2 = '223e4567-e89b-12d3-a456-426614174000';
      const transactionId1 = new TransactionId(uuid1);
      const transactionId2 = new TransactionId(uuid2);

      expect(transactionId1.equals(transactionId2)).toBe(false);
    });

    it('should return true when comparing same instance', () => {
      const transactionId = new TransactionId();

      expect(transactionId.equals(transactionId)).toBe(true);
    });

    it('should return false when comparing auto-generated TransactionIds', () => {
      const transactionId1 = new TransactionId();
      const transactionId2 = new TransactionId();

      expect(transactionId1.equals(transactionId2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the UUID value as string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const transactionId = new TransactionId(uuid);

      expect(transactionId.toString()).toBe(uuid);
    });

    it('should return auto-generated UUID as string', () => {
      const transactionId = new TransactionId();

      const result = transactionId.toString();

      expect(result).toBe(transactionId.value);
      expect(uuidValidate(result)).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should return the UUID value for JSON serialization', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const transactionId = new TransactionId(uuid);

      expect(transactionId.toJSON()).toBe(uuid);
    });

    it('should be serializable with JSON.stringify', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const transactionId = new TransactionId(uuid);

      const json = JSON.stringify({ transactionId });

      expect(json).toContain(uuid);
    });

    it('should return auto-generated UUID for JSON serialization', () => {
      const transactionId = new TransactionId();

      const result = transactionId.toJSON();

      expect(result).toBe(transactionId.value);
      expect(uuidValidate(result)).toBe(true);
    });
  });

  describe('generate', () => {
    it('should generate a new TransactionId', () => {
      const transactionId = TransactionId.generate();

      expect(transactionId).toBeInstanceOf(TransactionId);
      expect(uuidValidate(transactionId.value)).toBe(true);
    });

    it('should generate different TransactionIds on each call', () => {
      const transactionId1 = TransactionId.generate();
      const transactionId2 = TransactionId.generate();

      expect(transactionId1.value).not.toBe(transactionId2.value);
    });

    it('should generate TransactionId that can be compared', () => {
      const transactionId1 = TransactionId.generate();
      const transactionId2 = TransactionId.generate();

      expect(transactionId1.equals(transactionId2)).toBe(false);
      expect(transactionId1.equals(transactionId1)).toBe(true);
    });
  });
});
