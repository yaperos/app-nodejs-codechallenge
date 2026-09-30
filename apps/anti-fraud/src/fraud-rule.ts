import { TransactionStatus, type FinalTransactionStatus } from '@app/contracts';

export const MAX_APPROVED_VALUE = '1000.00';

const DECIMAL = /^\d+(\.\d{1,2})?$/;

// Monto decimal (string) a céntimos enteros: la comparación es exacta, sin floats.
export function toCents(value: string): bigint {
  if (!DECIMAL.test(value)) {
    throw new Error(`Invalid decimal amount: ${value}`);
  }
  const [units, fraction = ''] = value.split('.');
  return BigInt(units) * 100n + BigInt(fraction.padEnd(2, '0'));
}

// Regla del reto: valor > 1000 → rejected; exactamente 1000 se aprueba.
export function evaluate(value: string): FinalTransactionStatus {
  return toCents(value) > toCents(MAX_APPROVED_VALUE)
    ? TransactionStatus.Rejected
    : TransactionStatus.Approved;
}
