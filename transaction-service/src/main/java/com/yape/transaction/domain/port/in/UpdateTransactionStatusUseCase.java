package com.yape.transaction.domain.port.in;

import com.yape.transaction.domain.model.TransactionStatus;
import java.util.UUID;

public interface UpdateTransactionStatusUseCase {

    /**
     * Updates the status of a transaction.
     *
     * @param transactionExternalId the external ID of the transaction
     * @param status                the new status
     */
    void updateStatus(UUID transactionExternalId, TransactionStatus status);
}
