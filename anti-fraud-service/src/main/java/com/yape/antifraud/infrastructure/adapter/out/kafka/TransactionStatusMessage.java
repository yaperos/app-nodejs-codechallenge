package com.yape.antifraud.infrastructure.adapter.out.kafka;

import java.util.UUID;

public record TransactionStatusMessage(
        UUID transactionId,
        String status
) {}
