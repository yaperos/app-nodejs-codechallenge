import { updateTransactionExternalStatus } from '../useCases/updateTransactionExternalStatus';
import { AfterTransactionExternalResponse } from './AfterTransactionExternalResponse';

// Subscribers
new AfterTransactionExternalResponse(updateTransactionExternalStatus);
