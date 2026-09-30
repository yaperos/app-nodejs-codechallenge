import { InvalidTransactionError } from '../errors/domain.errors';
import { Money } from './money.vo';

describe('Money', () => {
    it('accepts positive values and rounds to 2 decimals', () => {
        expect(Money.of(120).amount).toBe(120);
        expect(Money.of(10.456).amount).toBe(10.46);
    });

    it.each([0, -5, Number.NaN, Number.POSITIVE_INFINITY])('rejects %p', (value) => {
        expect(() => Money.of(value)).toThrow(InvalidTransactionError);
    });
});