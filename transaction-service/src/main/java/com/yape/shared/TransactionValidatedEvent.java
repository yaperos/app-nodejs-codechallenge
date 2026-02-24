package com.yape.shared;


import java.util.UUID;

public record TransactionValidatedEvent(
        UUID transactionExternalId,
        String status
) {}
