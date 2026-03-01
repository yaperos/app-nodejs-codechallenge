package com.yape.transactions.dto.kafka;

import com.yape.transactions.model.TransactionStatus;

import java.util.UUID;

public record TransactionValidated(
        UUID id,
        TransactionStatus status
) {}
