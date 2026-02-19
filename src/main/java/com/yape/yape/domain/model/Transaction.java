package com.yape.yape.domain.model;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class Transaction {
    private final UUID transactionExternalId;
    private final UUID accountExternalIdDebit;
    private final UUID accountExternalIdCredit;
    private final int transferTypeId;
    private final TransactionType transactionType;
    private final TransactionStatus status;
    private final BigDecimal value;
    private final Instant createdAt;
}
