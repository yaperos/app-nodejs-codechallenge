package com.yaperos.codechallenge.transaction.domain.port.input;

import com.yaperos.codechallenge.shared.event.TransactionStatusType;

import java.util.UUID;

public interface UpdateTransactionStatusUseCase {

    void updateStatus(UUID transactionExternalId, TransactionStatusType status);

}
