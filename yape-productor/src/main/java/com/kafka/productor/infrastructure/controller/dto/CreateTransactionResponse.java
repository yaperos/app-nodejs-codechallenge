package com.kafka.productor.infrastructure.controller.dto;

import java.util.UUID;

public record CreateTransactionResponse(UUID transactionExternalId) {
    
}
