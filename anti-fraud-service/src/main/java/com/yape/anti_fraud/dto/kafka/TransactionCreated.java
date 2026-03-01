package com.yape.anti_fraud.dto.kafka;

import java.util.UUID;

public record TransactionCreated(
        UUID id,
        Double value
) {}