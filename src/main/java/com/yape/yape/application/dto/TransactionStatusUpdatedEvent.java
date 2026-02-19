package com.yape.yape.application.dto;

import com.yape.yape.domain.model.TransactionStatus;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionStatusUpdatedEvent {
    private UUID transactionExternalId;
    private TransactionStatus status;
    private Instant updatedAt;
}
