package com.yape.antifraud.kafka;

public record TransactionStatusEvent(
    String transactionExternalId,
    String status
) {}
