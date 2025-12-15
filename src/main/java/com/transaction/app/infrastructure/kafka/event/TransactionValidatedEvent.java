package com.transaction.app.infrastructure.kafka.event;

import com.transaction.app.domain.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionValidatedEvent {
    private UUID transactionExternalId;
    private TransactionStatus status;
}
