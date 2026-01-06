package com.yape.transactions.kafka;

public record TransactionStatusEvent(
    String transactionExternalId,
    String status
) {}
