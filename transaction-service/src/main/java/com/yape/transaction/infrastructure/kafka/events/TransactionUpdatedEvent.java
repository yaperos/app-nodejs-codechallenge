package com.yape.transaction.infrastructure.kafka.events;

import java.util.UUID;
import com.yape.transaction.domain.model.TransactionStatus;

public record TransactionUpdatedEvent(
  UUID id,
  TransactionStatus status
) {}
