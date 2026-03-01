package com.retotecnico.transaction.domain.port.in;

import java.util.UUID;

/**
 * Input port - use case for updating transaction status from anti-fraud.
 */
public interface UpdateTransactionStatusUseCase {

    void execute(UUID transactionExternalId, String status);
}
