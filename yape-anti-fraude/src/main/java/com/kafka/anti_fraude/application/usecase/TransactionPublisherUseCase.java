package com.kafka.anti_fraude.application.usecase;

import java.util.UUID;

public interface TransactionPublisherUseCase {

    void publishStatusUpdate(UUID transactionExternalId, String newStatus);

}
