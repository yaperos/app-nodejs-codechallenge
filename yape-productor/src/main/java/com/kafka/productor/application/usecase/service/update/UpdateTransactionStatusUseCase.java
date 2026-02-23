package com.kafka.productor.application.usecase.service.update;

import java.util.UUID;

public interface UpdateTransactionStatusUseCase {
    void execute(UUID transactionExternalId, String status);
}
