package com.yape.anti_fraud.dto.kafka;

import com.yape.anti_fraud.model.TransactionStatus;

import java.util.UUID;

public record TransactionValidated(
        UUID id,
        TransactionStatus status
) {}
