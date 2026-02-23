package com.kafka.anti_fraude.domain.command;

import java.util.UUID;

public record TransactionValidationCommand(
        UUID transactionExternalId,
        double value) {
}