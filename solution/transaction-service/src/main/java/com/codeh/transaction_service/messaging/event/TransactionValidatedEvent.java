package com.codeh.transaction_service.messaging.event;

import java.util.UUID;

public record TransactionValidatedEvent(UUID transactionExternalId, String status) {}