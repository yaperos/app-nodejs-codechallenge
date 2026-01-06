import { TransactionStatus } from './transaction-status.vo';

describe('TransactionStatus', () => {
    it('should have correct status values', () => {
        expect(TransactionStatus.PENDING).toBe('pending');
        expect(TransactionStatus.APPROVED).toBe('approved');
        expect(TransactionStatus.REJECTED).toBe('rejected');
    });

    it('should export all required status values', () => {
        const expectedStatuses = ['pending', 'approved', 'rejected'];
        const actualStatuses = Object.values(TransactionStatus);

        expect(actualStatuses).toEqual(expect.arrayContaining(expectedStatuses));
        expect(actualStatuses.length).toBe(expectedStatuses.length);
    });
});
