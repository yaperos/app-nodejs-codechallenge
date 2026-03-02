package com.yape.transaction.domain.port.in;

import com.yape.transaction.domain.model.TransactionStatus;

import java.util.UUID;

public interface UpdateTransactionStatusUseCase {

    void execute(Command command);

    record Command(UUID transactionExternalId, TransactionStatus newStatus) {}
}
