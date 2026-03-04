package com.yape.business.financial.infrastructure.events;

import com.yape.shared.domain.TransactionStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record TransactionCreatedEvent(
    UUID id,
    UUID accountExternalIdDebit,
    UUID accountExternalIdCredit,
    String transferType,
    TransactionStatus status,
    BigDecimal value
) implements TransactionEvent {}