package com.yape.challenge.antifraud.infrastructure.adapters.out.kafka.dto;

import com.yape.challenge.antifraud.domain.model.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class TransactionStatusUpdateEvent {
    private UUID transactionId;
    private TransactionStatus status;
}
