package com.yape.transaction.infrastructure.adapter.out.messaging;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreatedEvent(
        UUID transactionExternalId,
        UUID accountExternalIdDebit,
        UUID accountExternalIdCredit,
        String transactionType,
        BigDecimal value
) {}
