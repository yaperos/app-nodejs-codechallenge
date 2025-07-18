import { ValidationResultDto } from '../dto/validation-result.dto';

/**
 * Interface for transaction update operations
 * Segregated responsibility: Only handles transaction modifications
 */
export interface ITransactionUpdater {
  updateTrx(validationResult: ValidationResultDto): Promise<void>;
}
