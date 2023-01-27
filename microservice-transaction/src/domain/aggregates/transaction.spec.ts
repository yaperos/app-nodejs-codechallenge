import { Transaction } from "./transaction";

describe('trasaction Aggregate', () => {
    const transaction = new Transaction({
        transactionExternalId: 'transactionExternalId',
        accountExternalIdDebit: 'accountExternalIdDebit',
        accountExternalIdCredit: 'accountExternalIdCredit',
        tranferType: 1,
        status: 'status',
        value: 1,
    });

    it('should get status', () => {
       expect(transaction.getStatus()).toBe('status');
    });

    it('should get value', () => {
        expect(transaction.getValue()).toBe(1);
    });
    it('should get transactionExternalId', () => {
        expect(transaction.getTransactionExternalId()).toBe('transactionExternalId');
    });
    it('should get accountExternalIdDebit', () => {
        expect(transaction.getAccountExternalIdDebit()).toBe('accountExternalIdDebit');
    });
    it('should get accountExternalIdCredit', () => {
        expect(transaction.getAccountExternalIdCredit()).toBe('accountExternalIdCredit');
    });
    it('should get tranferType', () => {
        expect(transaction.getTranferType()).toBe(1);
    });
    it('should set status', () => {
        transaction.setStatus('status1')
        expect(transaction.getStatus()).toBe('status1');
    });

});