import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTransactionInput } from '../../src/modules/transaction/infrastructure/graphql/dto/create-transaction.input';

describe('CreateTransactionInput validation', () => {
    it('should fail if required fields are missing', () => {
      const input = new CreateTransactionInput();
      const errors = validateSync(input);
      expect(errors.length).toBeGreaterThan(0);
    });
  
    it('should pass if all fields are valid', () => {
      const input = plainToInstance(CreateTransactionInput, {
        accountExternalIdDebit: 'b2b6c42b-e92e-499e-9be0-9c5d91a13457',
        accountExternalIdCredit: 'c6e07e2c-13f2-4b36-8a97-521ad3b9fa6f',
        transferTypeId: 1,
        value: 100,
      });
  
      const errors = validateSync(input);
      expect(errors.length).toBe(0);
    });
  });