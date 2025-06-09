import { Kind, ValueNode } from 'graphql/language';
import { CustomUuidScalar } from './customUuid.scalar';

describe('CustomUuidScalar', () => {
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';
  const invalidUUID = 'invalid-uuid';

  describe('serialize', () => {
    it('should return the same UUID if valid', () => {
      expect(CustomUuidScalar.serialize(validUUID)).toBe(validUUID);
    });

    it('should throw an error if UUID is invalid', () => {
      expect(() => CustomUuidScalar.serialize(invalidUUID)).toThrow('invalid uuid');
    });
  });

  describe('parseValue', () => {
    it('should return the same UUID if valid', () => {
      expect(CustomUuidScalar.parseValue(validUUID)).toBe(validUUID);
    });

    it('should throw an error if UUID is invalid', () => {
      expect(() => CustomUuidScalar.parseValue(invalidUUID)).toThrow('invalid uuid');
    });
  });

  describe('parseLiteral', () => {
    it('should return the value if AST is valid UUID string', () => {
      const ast = { kind: Kind.STRING, value: validUUID } as ValueNode;
      expect(CustomUuidScalar.parseLiteral(ast, {})).toBe(validUUID);
    });

    it('should throw an error if AST is not a string', () => {
      const ast = { kind: Kind.INT, value: '123' } as ValueNode;
      expect(() => CustomUuidScalar.parseLiteral(ast, {})).toThrow('UUID must be a string');
    });

    it('should throw an error if AST string is invalid UUID', () => {
      const ast = { kind: Kind.STRING, value: invalidUUID } as ValueNode;
      expect(() => CustomUuidScalar.parseLiteral(ast, {})).toThrow('invalid uuid');
    });
  });
});
