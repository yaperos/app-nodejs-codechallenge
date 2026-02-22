package com.yape.transaction.infrastructure.adapter.in.kafka;

import java.util.UUID;

public record TransactionStatusMessage(UUID transactionId, String status) {}
