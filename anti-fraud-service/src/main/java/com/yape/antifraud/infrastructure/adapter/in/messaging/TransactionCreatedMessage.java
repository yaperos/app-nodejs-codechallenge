package com.yape.antifraud.infrastructure.adapter.in.messaging;

import java.math.BigDecimal;

public record TransactionCreatedMessage(
        String transactionExternalId,
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        String transactionType,
        BigDecimal value
) {}
