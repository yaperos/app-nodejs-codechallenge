package com.codeh.transaction_service.messaging.event;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreatedEvent(UUID transactionExternalId, BigDecimal value) {
}
