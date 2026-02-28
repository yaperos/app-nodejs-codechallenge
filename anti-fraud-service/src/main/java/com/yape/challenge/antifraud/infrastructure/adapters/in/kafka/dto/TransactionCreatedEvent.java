package com.yape.challenge.antifraud.infrastructure.adapters.in.kafka.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class TransactionCreatedEvent {
    private UUID transactionId;
    private Double value;
}
