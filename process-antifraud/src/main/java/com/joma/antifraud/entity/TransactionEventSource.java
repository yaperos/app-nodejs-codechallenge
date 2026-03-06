package com.joma.antifraud.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Table(name = "transaction_events")
public record TransactionEventSource(
        @Id
        Long id,
        String transactionExternalId,
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        String transactionName, //1=transferencia,2=pagos,3=compras
        BigDecimal amount,
        String transactionStatus,
        Integer version,
        Instant createdAt
) {
}