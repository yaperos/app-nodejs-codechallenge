import * as createFinancialTransactionProviders from 'src/adapters/financial-transactions/create';
import * as viewFinancialTransactionProviders from 'src/adapters/financial-transactions/view';

export const createFinancialTransactionAdapters = [...Object.values(createFinancialTransactionProviders)];
export const viewFinancialTransactionAdapters = [...Object.values(viewFinancialTransactionProviders)];
