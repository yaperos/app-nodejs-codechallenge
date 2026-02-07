package com.yape.codechallenge.event;

import java.util.UUID;

public record TransactionEvent(
                UUID transactionExternalId,
                Double value,
                String status) {
}
