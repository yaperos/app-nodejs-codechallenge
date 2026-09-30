import type { ArgumentsHost } from '@nestjs/common';
import {
    type DomainError,
    InvalidStatusTransitionError,
    InvalidTransactionError,
    TransactionNotFoundError,
} from '../../../domain/errors/domain.errors';
import { DomainExceptionFilter } from './domain-exception.filter';

function run(error: DomainError) {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
        switchToHttp: () => ({ getResponse: () => ({ status }) }),
    } as unknown as ArgumentsHost;

    new DomainExceptionFilter().catch(error, host);
    return { status, json };
}

describe('DomainExceptionFilter', () => {
    it.each([
        [new TransactionNotFoundError('id-1'), 404],
        [new InvalidStatusTransitionError('approved', 'rejected'), 409],
        [new InvalidTransactionError('bad input'), 422],
    ])('maps %p to HTTP %i', (error, expectedStatus) => {
        const { status, json } = run(error);

        expect(status).toHaveBeenCalledWith(expectedStatus);
        expect(json).toHaveBeenCalledWith({
            statusCode: expectedStatus,
            error: error.name,
            message: error.message,
        });
    });
});