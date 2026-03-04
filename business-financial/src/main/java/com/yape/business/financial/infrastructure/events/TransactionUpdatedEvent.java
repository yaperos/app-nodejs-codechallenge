package com.yape.business.financial.infrastructure.events;

import com.yape.shared.domain.TransactionStatus;
import lombok.Builder;

import java.util.UUID;

@Builder
public record TransactionUpdatedEvent(
    UUID id,
    TransactionStatus status
) implements TransactionEvent {}
