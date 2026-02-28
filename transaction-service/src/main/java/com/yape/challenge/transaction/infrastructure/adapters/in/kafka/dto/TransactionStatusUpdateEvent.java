package com.yape.challenge.transaction.infrastructure.adapters.in.kafka.dto;

import com.yape.challenge.transaction.domain.model.TransactionStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class TransactionStatusUpdateEvent {
    private UUID transactionId;
    private TransactionStatus status;
}
