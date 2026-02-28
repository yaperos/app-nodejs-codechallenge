package com.yape.challenge.transaction.infrastructure.adapters.out.kafka.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TransactionCreatedEvent {
    private UUID transactionId;
    private Double value;
}
