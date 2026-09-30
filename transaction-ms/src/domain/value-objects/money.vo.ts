import { InvalidTransactionError } from "../errors/domain.errors";

export class Money {
    private constructor(readonly amount: number) { }

    static of(amount: number): Money {
        if (amount <= 0 || Number.isNaN(amount) || !Number.isFinite(amount)) {
            throw new InvalidTransactionError('Transaction value must be greater than 0');
        }

        const roundedAmount = Math.round(amount * 100) / 100;

        return new Money(roundedAmount);
    }
}