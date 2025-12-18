package com.yape.antifraud.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionCreatedEvent(
        UUID transactionExternalId,
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        Integer transferTypeId,
        BigDecimal value,
        Instant createdAt
) {}
