import { TransactionRepository } from '../../domain/transaction.repository';
import { MockTransactionRepository } from './mock-transaction.repository';

const TransactionProviderRepository = {
    provide: TransactionRepository,
    useClass: MockTransactionRepository,
};

export default TransactionProviderRepository;
