package com.tec.yape.transaction.domain.model;

import com.tec.yape.transaction.domain.enums.TransactionStatus;

import java.util.UUID;

public record TransactionValidatedEvent(
        UUID transactionExternalId,
        TransactionStatus status) {
}
