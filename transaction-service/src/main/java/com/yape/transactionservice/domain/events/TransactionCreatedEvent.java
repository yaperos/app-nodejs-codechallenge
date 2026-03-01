package com.yape.transactionservice.domain.events;

import com.yape.transactionservice.domain.models.Transaction;

public record TransactionCreatedEvent(Transaction transaction) {
}
