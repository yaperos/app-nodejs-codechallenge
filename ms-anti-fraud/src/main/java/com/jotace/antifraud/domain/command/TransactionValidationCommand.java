package com.jotace.antifraud.domain.command;

import java.util.UUID;

public record TransactionValidationCommand(
        UUID transactionExternalId,
        double value) {
}