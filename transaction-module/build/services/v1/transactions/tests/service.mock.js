"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createdTransactionResponseMock = exports.createdTransactionMock = exports.transactionResponseMock = exports.transactionTypesMock = exports.transactionStatusMock = exports.transactionsMock = void 0;
exports.transactionsMock = [
    {
        transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8966',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid2',
        transferTypeId: '1',
        value: 700,
        transaction_status_id: 1,
        createdAt: '2021-09-03T19:21:32.000Z',
        updatedAt: '2021-09-03T19:21:32.000Z'
    },
    {
        transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8962',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid2',
        transferTypeId: '2',
        value: 1111,
        transaction_status_id: 3,
        createdAt: '2021-09-03T19:21:32.000Z',
        updatedAt: '2021-09-03T19:21:32.000Z'
    },
    {
        transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8963',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid2',
        transferTypeId: '1',
        value: 2000,
        transaction_status_id: 3,
        createdAt: '2021-09-03T19:21:32.000Z',
        updatedAt: '2021-09-03T19:21:32.000Z'
    },
    {
        transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8964',
        accountExternalIdDebit: 'Guid',
        accountExternalIdCredit: 'Guid2',
        transferTypeId: '1',
        value: 300,
        transaction_status_id: 2,
        createdAt: '2021-09-03T19:21:32.000Z',
        updatedAt: '2021-09-03T19:21:32.000Z'
    }
];
exports.transactionStatusMock = [
    {
        transaction_status_id: 1,
        name: 'PENDING'
    },
    {
        transaction_status_id: 2,
        name: 'APPROVED'
    },
    {
        transaction_status_id: 3,
        name: 'REJECTED'
    }
];
exports.transactionTypesMock = [
    {
        transaction_type_id: 1,
        name: 'WITHDRAWAL'
    },
    {
        transaction_type_id: 2,
        name: 'DEPOSIT'
    }
];
exports.transactionResponseMock = {
    data: [
        {
            transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8962',
            accountExternalIdDebit: 'Guid',
            accountExternalIdCredit: 'Guid2',
            transferTypeId: '2',
            value: 1111,
            transaction_status_id: 3,
            createdAt: '2021-09-03T19:21:32.000Z',
            updatedAt: '2021-09-03T19:21:32.000Z',
            transaction_status: {
                transaction_status_id: 3,
                name: 'REJECTED'
            },
            transaction_type: {
                transaction_type_id: 2,
                name: 'DEPOSIT'
            }
        },
        {
            transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8963',
            accountExternalIdDebit: 'Guid',
            accountExternalIdCredit: 'Guid2',
            transferTypeId: '1',
            value: 2000,
            transaction_status_id: 3,
            createdAt: '2021-09-03T19:21:32.000Z',
            updatedAt: '2021-09-03T19:21:32.000Z',
            transaction_status: {
                transaction_status_id: 3,
                name: 'REJECTED'
            },
            transaction_type: {
                transaction_type_id: 1,
                name: 'WITHDRAWAL'
            }
        },
        {
            transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8964',
            accountExternalIdDebit: 'Guid',
            accountExternalIdCredit: 'Guid2',
            transferTypeId: '1',
            value: 300,
            transaction_status_id: 2,
            createdAt: '2021-09-03T19:21:32.000Z',
            updatedAt: '2021-09-03T19:21:32.000Z',
            transaction_status: {
                transaction_status_id: 2,
                name: 'APPROVED'
            },
            transaction_type: {
                transaction_type_id: 1,
                name: 'WITHDRAWAL'
            }
        },
        {
            transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8966',
            accountExternalIdDebit: 'Guid',
            accountExternalIdCredit: 'Guid2',
            transferTypeId: '1',
            value: 700,
            transaction_status_id: 1,
            createdAt: '2021-09-03T19:21:32.000Z',
            updatedAt: '2021-09-03T19:21:32.000Z',
            transaction_status: {
                transaction_status_id: 1,
                name: 'PENDING'
            },
            transaction_type: {
                transaction_type_id: 1,
                name: 'WITHDRAWAL'
            }
        }
    ],
    pagination: {
        count: 4,
        limit: 20,
        page: 1
    }
};
exports.createdTransactionMock = {
    transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8911',
    accountExternalIdDebit: 'Guid',
    accountExternalIdCredit: 'Guid2',
    transferTypeId: '1',
    value: 558,
    transaction_status_id: 1,
    createdAt: '2021-09-03T19:21:32.000Z'
};
exports.createdTransactionResponseMock = {
    transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8911',
    accountExternalIdDebit: 'Guid',
    accountExternalIdCredit: 'Guid2',
    transferTypeId: '1',
    value: 558,
    transaction_status_id: 1,
    createdAt: '2021-09-03T19:21:32.000Z'
};
