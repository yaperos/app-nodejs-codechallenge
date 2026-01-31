package com.devpull.transactionservice.adapter.out.client.mapper;

import com.devpull.transactionservice.adapter.out.client.dto.TransactionCreatedEvent;
import com.devpull.transactionservice.domain.model.Transaction;

public final class AntiFraudEventMapper {

    private AntiFraudEventMapper() {}

    public static TransactionCreatedEvent toCreatedEvent(Transaction tx) {
        return new TransactionCreatedEvent(
                tx.getId(),
                tx.getAccountId(),
                tx.getType().name(),
                tx.getAmount()
        );
    }
}
