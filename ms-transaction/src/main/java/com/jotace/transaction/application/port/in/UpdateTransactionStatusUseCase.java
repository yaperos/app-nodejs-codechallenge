package com.jotace.transaction.application.port.in;

import java.util.UUID;

public interface UpdateTransactionStatusUseCase {

    void updateStatus(UUID transactionExternalId, String newStatus);

}
