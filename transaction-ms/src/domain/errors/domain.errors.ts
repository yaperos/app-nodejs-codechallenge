export abstract class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class InvalidTransactionError extends DomainError { }

export class TransactionNotFoundError extends DomainError {
    constructor(transactionId: string) {
        super(`Transaction with ID ${transactionId} not found`);
    }
}

export class InvalidStatusTransitionError extends DomainError {
    constructor(from: string, to: string) {
        super(`Cannot transition transaction from ${from} to ${to}`);
    }
}