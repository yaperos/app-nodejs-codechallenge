import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export class DecimalTypeORMTransformer implements ValueTransformer {
  to(value?: Decimal): string | null {
    return value?.toString() ?? null;
  }
  from(value: string): Decimal | null {
    return value ? new Decimal(value) : null;
  }
}
