package com.yape.antifraudservice.models;

import com.yape.antifraudservice.enums.TransactionStatus;
import org.apache.kafka.common.protocol.types.Field;

import java.math.BigDecimal;
import java.util.UUID;


public record TransactionEvent(UUID transactionExternalId, TransactionStatus status, BigDecimal value) {
}
