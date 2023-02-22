import { TransactionRepository } from '../../domain/transaction.repository';
// import { MockTransactionRepository } from './mock-transaction.repository';
import { TypeOrmTransactionRepository } from './typeorm/typeorm-transaction.repository';

const TransactionProviderRepository = {
    provide: TransactionRepository,
    useClass: TypeOrmTransactionRepository,
};

export default TransactionProviderRepository;
