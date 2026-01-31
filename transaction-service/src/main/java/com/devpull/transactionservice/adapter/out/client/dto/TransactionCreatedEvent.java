package com.devpull.transactionservice.adapter.out.client.dto;


import java.util.UUID;

public record TransactionCreatedEvent(
        UUID transactionId,
        UUID accountId,
        String type,
        double amount
) {
}
