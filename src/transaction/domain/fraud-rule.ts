import { MoneyVo } from './value-objects/money.vo.js';

/** Challenge rule: transactions with value strictly greater than 1000 are rejected. */
export function evaluateFraudDecision(value: number): 'approved' | 'rejected' {
  const money = MoneyVo.of(value);
  return money.exceeds(1000) ? 'rejected' : 'approved';
}
