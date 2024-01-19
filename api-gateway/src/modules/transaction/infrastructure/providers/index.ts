import { TRANSACTION_CLIENT_PROVIDER_ALIAS } from 'src/modules/transaction/domain/providers/transaction-client.provider';

import { GrpcTransactionClientProvider } from './grpc-transaction-client.provider';

export const Providers = [
  {
    provide: TRANSACTION_CLIENT_PROVIDER_ALIAS,
    useClass: GrpcTransactionClientProvider,
  },
];
