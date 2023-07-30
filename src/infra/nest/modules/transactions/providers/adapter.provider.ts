import * as createFinancialTransactionProviders from 'src/adapters/financial-transactions/create';

export const createFinancialTransactionAdapters = [...Object.values(createFinancialTransactionProviders)];
